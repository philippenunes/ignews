import { stripe } from "@/src/services/stripe";
import { db } from "@/src/services/firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

export async function saveSubscription(
    subscriptionId: string,
    customerId: string
) {
    // Busca o usuário no Firebase usando o stripeCustomerId
    const userQuery = query(
        collection(db, "users"),
        where("stripeCustomerId", "==", customerId)
    );
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
        throw new Error('User not found with this customer ID');
    }

    const userDoc = userSnapshot.docs[0];
    const userId = userDoc.id;

    // Recupera a subscription no Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Salva a subscription no Firebase
    await addDoc(collection(db, "subscriptions"), {
        id: subscriptionId,
        userId: userId,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id
    });
}

export async function deactivateSubscription(
    subscriptionId: string
) {
    // Busca a subscription no Firebase pelo ID
    const subscriptionQuery = query(
        collection(db, "subscriptions"),
        where("id", "==", subscriptionId)
    );
    const subscriptionSnapshot = await getDocs(subscriptionQuery);

    if (subscriptionSnapshot.empty) {
        throw new Error('Subscription not found in database');
    }

    const subscriptionDoc = subscriptionSnapshot.docs[0];

    // Recupera a subscription atualizada no Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    await updateDoc(doc(db, "subscriptions", subscriptionDoc.id), {
        status: subscription.status
    });
}