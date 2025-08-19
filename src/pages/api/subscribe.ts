import { stripe } from "@/src/services/stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { db } from "@/src/services/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method not allowed');
        return;
    }

    if (!session?.user?.email) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        // Verifica se o usuário já tem um customer no Stripe
        const userQuery = query(
            collection(db, "users"),
            where("email", "==", session.user.email)
        );
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
            res.status(404).json({ error: 'User not found in database' });
            return;
        }

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        let stripeCustomerId: string;

        // Se já tem customerId, reutiliza
        if (userData.stripeCustomerId) {
            stripeCustomerId = userData.stripeCustomerId;
            console.log('Reusing existing Stripe customer:', stripeCustomerId);
        } else {
            // Cria novo customer no Stripe
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
            });
            stripeCustomerId = stripeCustomer.id;

            // Salva o customerId no Firebase
            await updateDoc(doc(db, "users", userDoc.id), {
                stripeCustomerId: stripeCustomerId
            });
            console.log('Created new Stripe customer:', stripeCustomerId);
        }

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: 'price_1RwpExRwgw3ZCnDZdrOIDS9c', quantity: 1 }
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL!,
            cancel_url: process.env.STRIPE_CANCEL_URL!,
        });

        return res.status(200).json({ sessionId: stripeCheckoutSession.id });
    } catch (error) {
        console.error('Error in subscribe:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}