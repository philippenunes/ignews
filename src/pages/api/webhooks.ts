import { stripe } from "@/src/services/stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { saveSubscription, deactivateSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable) {
    const chunks = [];

    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }

    return Buffer.concat(chunks);
}

export const config = {
    api: {
        bodyParser: false,
    }
}

const relevantEvents = new Set<Stripe.Event['type']>([
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted'
])

export default async function webhooks(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method not allowed');
        return;
    }

    const buf = await buffer(req);
    const signatureHeader = req.headers['stripe-signature'];

    if (!signatureHeader) {
        console.warn('[Stripe Webhook] Missing stripe-signature header');
        return res.status(400).send('Missing stripe-signature header');
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            buf,
            Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        return res.status(400).send(`Webhook error: ${err}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
        try {
            switch (type) {
                case 'checkout.session.completed':
                    const checkoutSession = event.data.object as Stripe.Checkout.Session;

                    await saveSubscription(
                        checkoutSession.subscription?.toString()!,
                        checkoutSession.customer?.toString()!
                    )
                    break;
                case 'customer.subscription.updated':
                    // TODO: Handle subscription updated
                    break;
                case 'customer.subscription.deleted':
                    const deletedSubscription = event.data.object as Stripe.Subscription;
                    await deactivateSubscription(deletedSubscription.id);
                    break;
                default:
                    throw new Error('Unhandled event!')
            }
        } catch (err) {
            console.log(err)
        }
    }

    res.status(200).json({ received: true })
}