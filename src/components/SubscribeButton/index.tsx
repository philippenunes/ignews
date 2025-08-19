import { signIn, useSession } from 'next-auth/react';
import styles from './styles.module.scss';
import { api } from '@/src/services/api';
import { getStripeJs } from '@/src/services/stripe.-js';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn('github');
      return;
    }

    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      const stripe = await getStripeJs()

      stripe?.redirectToCheckout({ sessionId });
    } catch (err: any) {
      console.log(err);
      alert(err.response.data.error);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}