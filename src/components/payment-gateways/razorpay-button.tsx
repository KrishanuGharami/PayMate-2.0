'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
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


export const RazorpayButton = ({ amount }: { amount: number }) => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not load Razorpay script. Please check your network connection.',
        })
    }
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [toast]);

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      toast({
        variant: 'destructive',
        title: 'Razorpay not loaded',
        description: 'Please wait a moment and try again.',
      });
      return;
    }
    
    setIsLoading(true);

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
                toast({
                    variant: 'success',
                    title: 'Payment Successful!',
                    description: `Razorpay Payment ID: ${response.razorpay_payment_id}`,
                });
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
        console.error('Razorpay payment error:', error);
        toast({
            variant: 'destructive',
            title: 'Payment Failed',
            description: 'Could not initiate Razorpay payment.',
        });
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
