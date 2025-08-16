import Stripe from 'stripe'
import { version } from '../../package.json'

if (!process.env.STRIPE_API_KEY) {
    throw new Error("❌ Variável STRIPE_API_KEY não definida no .env.local");
}

export const stripe = new Stripe(
    process.env.STRIPE_API_KEY,
    {
        apiVersion: '2025-07-30.basil',
        appInfo: {
            name: 'Ignews',
            version
        }
    }
)