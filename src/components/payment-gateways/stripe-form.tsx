'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useTheme } from 'next-themes'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface CheckoutFormProps {
    amount: number;
    onInitiatePayment: () => Promise<boolean>;
    onSuccess: (details: { transactionId: string }) => void;
    onError: (error: { message: string }) => void;
}


const CheckoutForm = ({ amount, onInitiatePayment, onSuccess, onError }: CheckoutFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    if (!stripe || !elements) {
      onError({ message: "Stripe.js has not loaded yet." });
      setIsLoading(false);
      return
    }

    const canProceed = await onInitiatePayment();
    if (!canProceed) {
        setIsLoading(false);
        // The parent component has already updated the UI to show an error (e.g., fraud detected)
        return;
    }

    try {
        const response = await fetch('/api/payment/stripe/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount }),
        });

        if (!response.ok) {
            throw new Error('Failed to create payment intent');
        }

        const { clientSecret } = await response.json();

        // If we are using a mock secret, bypass the Stripe confirmation
        // and simulate a successful payment.
        if (clientSecret.startsWith('mock_pi_')) {
            console.log("Mock payment successful for Stripe.");
            setTimeout(() => {
                onSuccess({ transactionId: `MOCK_STRIPE_${clientSecret.split('_secret_')[0]}` });
                setIsLoading(false);
            }, 1500); // Simulate network delay
            return;
        }

        const cardElement = elements.getElement(CardElement)
        if (!cardElement) {
            setIsLoading(false);
            onError({ message: "Card element not found." });
            return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (error) {
            onError({ message: error.message || 'An unknown payment error occurred.' });
        } else if (paymentIntent.status === 'succeeded') {
            onSuccess({ transactionId: paymentIntent.id });
        }
    } catch (e: any) {
         onError({ message: e.message || 'An unexpected error occurred.' });
    } finally {
         setIsLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: theme === 'dark' ? '#ffffff' : '#424770',
        '::placeholder': {
          color: theme === 'dark' ? '#aab7c4' : '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 border rounded-md bg-background">
        <CardElement options={cardElementOptions} />
      </div>
      <Button disabled={!stripe || isLoading} className="w-full" type="submit">
        {isLoading ? <Loader2 className="animate-spin" /> : `Pay ₹${(amount / 100).toFixed(2)}`}
      </Button>
    </form>
  )
}

interface StripeFormProps {
    amount: number;
    onInitiatePayment: () => Promise<boolean>;
    onSuccess: (details: { transactionId: string }) => void;
    onError: (error: { message: string }) => void;
}

export const StripeForm = ({ amount, onInitiatePayment, onSuccess, onError }: StripeFormProps) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm 
      amount={amount} 
      onInitiatePayment={onInitiatePayment}
      onSuccess={onSuccess}
      onError={onError}
    />
  </Elements>
)
