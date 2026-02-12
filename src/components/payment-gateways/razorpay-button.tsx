'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

// This is a simplified type definition for Razorpay options.
// Refer to Razorpay documentation for the full list of options.
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: { razorpay_payment_id: string }) => void;
  modal: {
    ondismiss: () => void;
  };
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

interface RazorpayButtonProps {
    amount: number;
    onProcessing: () => void;
    onSuccess: (details: { transactionId: string }) => void;
    onError: (error: { message: string }) => void;
}


export const RazorpayButton = ({ amount, onProcessing, onSuccess, onError }: RazorpayButtonProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
        setIsScriptLoaded(true);
        setIsLoading(false);
    };
    script.onerror = () => {
        onError({ message: 'Could not load Razorpay script. Please check your network connection.'});
        setIsLoading(false);
    }
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [onError]);

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      onError({ message: 'Razorpay script not loaded. Please wait and try again.'});
      return;
    }
    
    setIsLoading(true);
    onProcessing();

    try {
        // 1. Create an order on your server
        const orderResponse = await fetch('/api/payment/razorpay/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount }),
        });

        if (!orderResponse.ok) {
            throw new Error('Failed to create Razorpay order');
        }

        const order = await orderResponse.json();

        // 2. Open Razorpay checkout
        const options: RazorpayOptions = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            amount: order.amount,
            currency: 'INR',
            name: 'PayMate 2.0',
            description: 'Transaction',
            order_id: order.id,
            handler: function (response) {
                onSuccess({ transactionId: response.razorpay_payment_id });
            },
            modal: {
                ondismiss: function() {
                    onError({ message: 'Payment modal was closed.' });
                }
            },
            prefill: {
                name: 'Krishanu Gharami',
                email: 'krishanu.gharami@example.com',
                contact: '9999999999',
            },
            theme: {
                color: '#2D90FF', // Primary color
            },
        };
        
        const rzp = new window.Razorpay(options);
        rzp.open();

    } catch (error) {
        onError({ message: 'Could not initiate Razorpay payment.' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={isLoading || !isScriptLoaded} className="w-full">
      {isLoading ? <Loader2 className="animate-spin" /> : `Pay ₹${(amount / 100).toFixed(2)} with Razorpay`}
    </Button>
  )
}
