'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StripeForm } from '@/components/payment-gateways/stripe-form'
import { PayPalButtonsWrapper } from '@/components/payment-gateways/paypal-button'
import { RazorpayButton } from '@/components/payment-gateways/razorpay-button'
import { CreditCard, Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

type PaymentStatus = 'idle' | 'processing' | 'succeeded' | 'failed';
type PaymentError = { message: string };
type PaymentSuccess = { transactionId: string };

export function PaymentPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const amount = searchParams.get('amount') || '0';
    const recipient = searchParams.get('recipient');
    const description = searchParams.get('description');

    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
    const [paymentError, setPaymentError] = useState<PaymentError | null>(null);
    const [paymentSuccess, setPaymentSuccess] = useState<PaymentSuccess | null>(null);

    const amountInCents = Math.round(parseFloat(amount) * 100);

    const handleSuccess = (details: PaymentSuccess) => {
        setPaymentSuccess(details);
        setPaymentStatus('succeeded');
    };

    const handleError = (error: PaymentError) => {
        setPaymentError(error);
        setPaymentStatus('failed');
    };

    const handleRetry = () => {
        setPaymentStatus('idle');
        setPaymentError(null);
        setPaymentSuccess(null);
    };

    const handleNewPayment = () => {
        router.push('/dashboard');
    }

    if (paymentStatus === 'processing') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
                <h1 className="text-2xl font-bold tracking-tight">Processing Payment...</h1>
                <p className="text-muted-foreground mt-2">Please do not close or refresh the page.</p>
            </div>
        );
    }
    
    if (paymentStatus === 'succeeded') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <CheckCircle className="h-16 w-16 text-success mb-6" />
                <h1 className="text-2xl font-bold tracking-tight">Payment Successful!</h1>
                <p className="text-muted-foreground mt-2">Your payment of <span className="font-bold text-primary">₹{amount}</span> has been completed.</p>
                {paymentSuccess?.transactionId && (
                    <p className="text-sm text-muted-foreground mt-2">Transaction ID: {paymentSuccess.transactionId}</p>
                )}
                <Button onClick={handleNewPayment} className="mt-8">
                    Make Another Payment
                </Button>
            </div>
        );
    }

    if (paymentStatus === 'failed') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <XCircle className="h-16 w-16 text-destructive mb-6" />
                <h1 className="text-2xl font-bold tracking-tight">Transaction Failed</h1>
                <p className="text-muted-foreground mt-2">{paymentError?.message || 'An unexpected error occurred.'}</p>
                <Button onClick={handleRetry} className="mt-8">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry Payment
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Complete Your Payment</h1>
                <p className="text-muted-foreground mt-2">You are paying <span className="font-bold text-primary">₹{amount}</span> {recipient ? `to ${recipient}` : ''}</p>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </header>
            
            <div className="max-w-md mx-auto">
                <Card className="shadow-lg border-none">
                    <CardHeader>
                        <CardTitle>Choose Payment Method</CardTitle>
                        <CardDescription>Select a provider to finalize your transaction.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="stripe" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 h-auto">
                                <TabsTrigger value="stripe" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md"><CreditCard className="mr-2 h-4 w-4" /> Card</TabsTrigger>
                                <TabsTrigger value="paypal" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md">
                                    <Image src="https://www.paypalobjects.com/images/shared/momgram@2x.png" alt="PayPal" width={60} height={16} className="dark:brightness-0 dark:invert-[1]"/>
                                </TabsTrigger>
                                <TabsTrigger value="razorpay" className="py-2.5 data-[state=active]:bg-[#0353a2] data-[state=active]:text-white data-[state=active]:shadow-md flex items-center justify-center">
                                    <svg viewBox="0 0 280 60" width="100" height="24" className="fill-current"><path d="M242.4 34.2c0 2.2-1.4 3-2.9 3.2-1.7.3-3.2.4-4.6.4s-2.8-.1-4.6-.4c-1.5-.2-2.9-.9-2.9-3.2V20.3h2.6v12.8c0 1.2 1.1 1.6 2.1 1.7 1.2.2 2.5.3 3.8.3s2.6-.1 3.8-.3c1-.1 2.1-.5 2.1-1.7V20.3h2.6v13.9zM224.4 20.3h-3.4l-4.2 11.2-4.2-11.2h-3.4l6.1 14.8h2.8l6.1-14.8zM200.2 20.3h10.1v2.1h-7.5v4.3h7.1v2.1h-7.1v4.3h7.5v2.1h-10.1V20.3zM186.1 20.3h2.6v14.8h-2.6V20.3zM172.6 35.1h-3.2l.9-2.1h5.6l.9 2.1h-3.1l-1.1-2.9zM170.8 28l-2.1-5.1-2.1 5.1h4.2zM161.4 20.3h2.6v14.8h-2.6V20.3zM147.2 20.3h3.5c4.7 0 7.5 2.4 7.5 7.4 0 5-2.8 7.4-7.5 7.4h-3.5V20.3zm2.6 12.8h.9c3 0 4.9-1.5 4.9-5.4s-1.9-5.4-4.9-5.4h-.9v10.8zM128.8 20.3h10.1v2.1h-7.5v4.3h7.1v2.1h-7.1v4.3h7.5v2.1h-10.1V20.3zM102.3 27.7c0 4.9 2.4 7.5 7.3 7.5 2.4 0 4.4-.9 6-2.5l-1.6-1.3c-1.3 1.2-2.6 1.8-4.4 1.8-3.3 0-4.8-1.9-4.8-5.5s1.5-5.5 4.8-5.5c1.8 0 3.1.6 4.4 1.8l1.6-1.3c-1.6-1.6-3.6-2.5-6-2.5-4.9 0-7.3 2.5-7.3 7.5zM88.7 20.3h2.5L85 30.6v4.5h-2.6v-4.5L76.2 20.3h2.5l5.1 8.8 5-8.8zM63.8 34.2c0 2.2-1.4 3-2.9 3.2-1.7.3-3.2.4-4.6.4s-2.8-.1-4.6-.4c-1.5-.2-2.9-.9-2.9-3.2V20.3h2.6v12.8c0 1.2 1.1 1.6 2.1 1.7 1.2.2 2.5.3 3.8.3s2.6-.1 3.8-.3c1-.1 2.1-.5 2.1-1.7V20.3h2.6v13.9zM42.3 20.3h2.6v12.8c0 .8.6 1.1 1.2 1.2l.9.1h.2v2.2c-.6 0-1.3-.1-2-.1-1.8-.2-3-1.1-3-3.5V20.3zM25.6 20.3h3.5c4.7 0 7.5 2.4 7.5 7.4s-2.8 7.4-7.5 7.4h-3.5V20.3zm2.6 12.8h.9c3 0 4.9-1.5 4.9-5.4s-1.9-5.4-4.9-5.4h-.9v10.8zM14.3 22.4h-2.8v-2.1h8.2v2.1h-2.8V35.1h-2.6V22.4z"></path></svg>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="stripe" className="mt-6">
                               <StripeForm 
                                 amount={amountInCents} 
                                 onProcessing={() => setPaymentStatus('processing')}
                                 onSuccess={handleSuccess}
                                 onError={handleError}
                               />
                            </TabsContent>
                            <TabsContent value="paypal" className="mt-6">
                                <PayPalButtonsWrapper 
                                  amount={amount} 
                                  onProcessing={() => setPaymentStatus('processing')}
                                  onSuccess={handleSuccess}
                                  onError={handleError}
                                />
                            </TabsContent>
                            <TabsContent value="razorpay" className="mt-6">
                                <RazorpayButton 
                                  amount={amountInCents} 
                                  onProcessing={() => setPaymentStatus('processing')}
                                  onSuccess={handleSuccess}
                                  onError={handleError}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
