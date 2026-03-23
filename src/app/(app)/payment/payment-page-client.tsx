'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StripeForm } from '@/components/payment-gateways/stripe-form'
import { PayPalButtonsWrapper } from '@/components/payment-gateways/paypal-button'
import { RazorpayButton } from '@/components/payment-gateways/razorpay-button'
import { CreditCard, Loader2, CheckCircle, XCircle, RefreshCw, ShieldAlert, ShieldCheck, Zap, ArrowRight, Shield } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { detectFraud, FraudDetectionInput } from '@/ai/flows/fraud-detection-flow'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'

type PaymentStatus = 'idle' | 'processing' | 'succeeded' | 'failed';
type PaymentError = { message: string, isFraud?: boolean };
type PaymentSuccess = { transactionId: string };

const STEPS = [
  { id: 'security', label: 'Security Scan', icon: ShieldCheck },
  { id: 'fraud', label: 'Fraud Check', icon: Shield },
  { id: 'gateway', label: 'Gateway Handshake', icon: Zap },
  { id: 'finalizing', label: 'Finalizing', icon: CheckCircle },
];

export function PaymentPageClient() {
    const router = useRouter();
    const { toast } = useToast();
    const searchParams = useSearchParams()
    const amount = searchParams.get('amount') || '0';
    const recipient = searchParams.get('recipient');
    const description = searchParams.get('description');

    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
    const [paymentError, setPaymentError] = useState<PaymentError | null>(null);
    const [paymentSuccess, setPaymentSuccess] = useState<PaymentSuccess | null>(null);
    const [lastPaymentAttempt, setLastPaymentAttempt] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const amountInCents = Math.round(parseFloat(amount) * 100);
    const numericAmount = parseFloat(amount);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (paymentStatus === 'processing') {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    const next = prev + Math.random() * 15;
                    // Update step based on progress
                    if (next < 25) setCurrentStepIndex(0);
                    else if (next < 50) setCurrentStepIndex(1);
                    else if (next < 75) setCurrentStepIndex(2);
                    else setCurrentStepIndex(3);
                    
                    return next;
                });
            }, 600);
        } else {
            setProgress(0);
            setCurrentStepIndex(0);
        }
        return () => clearInterval(interval);
    }, [paymentStatus]);

    const handleSuccess = (details: PaymentSuccess) => {
        setPaymentSuccess(details);
        setPaymentStatus('succeeded');
    };

    const handleError = (error: PaymentError) => {
        setPaymentError(error);
        setPaymentStatus('failed');
    };

    const handleInitiatePayment = async (): Promise<boolean> => {
        const now = Date.now();
        if (lastPaymentAttempt && (now - lastPaymentAttempt < 5000)) {
            toast({
                title: 'Hold on!',
                description: 'We are processing your previous request. Please wait 5 seconds before trying again.',
                variant: 'destructive',
            });
            return false;
        }
        setLastPaymentAttempt(now);
        setPaymentStatus('processing');
        setProgress(5);

        try {
            const fraudCheckInput: FraudDetectionInput = {
                amount: numericAmount,
                recipientId: recipient || 'unknown',
                transactionTime: new Date().toISOString(),
                userHistory: {
                    averageAmount: 500,
                    commonRecipients: ['mom@upi', 'friend@paymate', 'Starbucks'],
                    unusualLocation: numericAmount > 20000,
                },
            };
            
            const fraudResult = await detectFraud(fraudCheckInput);

            if (fraudResult.isFraudulent) {
                handleError({
                    message: `Security Alert: This transaction was flagged because: ${fraudResult.reason}. Please contact support if you think this is a mistake.`,
                    isFraud: true,
                });
                return false;
            }

            return true;

        } catch (error) {
            console.error("Fraud detection error:", error);
            // Fallback for demo purposes
            return true;
        }
    };

    const handleRetry = () => {
        setPaymentStatus('idle');
        setPaymentError(null);
        setPaymentSuccess(null);
        setProgress(0);
    };

    const handleNewPayment = () => {
        router.push('/dashboard');
    }

    if (paymentStatus === 'processing') {
        const CurrentStepIcon = STEPS[currentStepIndex].icon;
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 max-w-lg mx-auto space-y-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                    <div className="relative bg-card border-4 border-primary/20 p-6 rounded-full">
                        <CurrentStepIcon className="h-12 w-12 text-primary animate-bounce" />
                    </div>
                </div>
                
                <div className="space-y-4 w-full">
                    <div className="flex justify-between text-sm font-medium mb-1">
                        <span className="text-primary">{STEPS[currentStepIndex].label}...</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2 w-full" />
                    
                    <div className="grid grid-cols-4 gap-2">
                        {STEPS.map((step, idx) => (
                            <div key={step.id} className="flex flex-col items-center gap-1">
                                <div className={`h-1.5 w-full rounded-full transition-colors duration-500 ${idx <= currentStepIndex ? 'bg-primary' : 'bg-muted'}`} />
                                <span className={`text-[10px] uppercase tracking-tighter ${idx === currentStepIndex ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                                    {step.id}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">PayMate 2.0 Secure Engine</h1>
                    <p className="text-muted-foreground">Verifying your transaction with bank-grade encryption. This usually takes a few seconds.</p>
                </div>
            </div>
        );
    }
    
    if (paymentStatus === 'succeeded') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 max-w-md mx-auto">
                <div className="p-4 bg-success/10 rounded-full mb-6">
                    <CheckCircle className="h-16 w-16 text-success" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Payment Successful!</h1>
                <p className="text-muted-foreground mt-2">Your payment of <span className="font-bold text-primary">₹{amount}</span> to <span className="font-medium text-foreground">{recipient || 'the recipient'}</span> has been confirmed.</p>
                {paymentSuccess?.transactionId && (
                    <div className="mt-6 p-3 bg-muted/50 rounded-lg border border-border w-full">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Receipt ID</p>
                        <p className="text-sm font-mono break-all">{paymentSuccess.transactionId}</p>
                    </div>
                )}
                <div className="flex flex-col gap-3 w-full mt-8">
                    <Button onClick={handleNewPayment} className="w-full h-11">
                        Go to Dashboard
                    </Button>
                    <Button variant="outline" onClick={() => window.print()} className="w-full h-11">
                        Download Receipt
                    </Button>
                </div>
            </div>
        );
    }

    if (paymentStatus === 'failed') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 max-w-md mx-auto">
                 <div className="p-4 bg-destructive/10 rounded-full mb-6">
                    {paymentError?.isFraud ? (
                        <ShieldAlert className="h-16 w-16 text-destructive" />
                    ) : (
                        <XCircle className="h-16 w-16 text-destructive" />
                    )}
                 </div>
                <h1 className="text-2xl font-bold tracking-tight">
                    {paymentError?.isFraud ? 'Security Block' : 'Transaction Failed'}
                </h1>
                <div className="mt-4 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive font-medium">{paymentError?.message || 'An unexpected connection error occurred. Please try again.'}</p>
                </div>
                <div className="flex flex-col gap-3 w-full mt-8">
                    <Button onClick={handleRetry} className="w-full h-11">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry Transaction
                    </Button>
                    <Button variant="ghost" onClick={() => router.push('/support')} className="w-full">
                        Contact PayMate 2.0 Support
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col items-center">
            <header className="mb-8 text-center max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                    <ShieldCheck className="h-3 w-3" /> PayMate 2.0 Secure Checkout
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Confirm Payment</h1>
                <p className="text-muted-foreground mt-2">Sending <span className="text-foreground font-semibold">₹{amount}</span> to <span className="text-foreground font-semibold">{recipient || 'the selected recipient'}</span></p>
                {description && <p className="text-sm text-muted-foreground italic mt-1">"{description}"</p>}
            </header>
            
            <div className="w-full max-w-md">
                <Card className="shadow-2xl border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x" />
                    <CardHeader>
                        <CardTitle className="text-lg">Select Payment Mode</CardTitle>
                        <CardDescription>Choose your preferred gateway to proceed.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="stripe" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 bg-muted/30 p-1 mb-6">
                                <TabsTrigger value="stripe" className="data-[state=active]:bg-background"><CreditCard className="mr-2 h-4 w-4" /> Card</TabsTrigger>
                                <TabsTrigger value="paypal" className="data-[state=active]:bg-background">
                                    <Image src="https://www.paypalobjects.com/images/shared/momgram@2x.png" alt="PayPal" width={50} height={12} className="dark:brightness-0 dark:invert-[1]"/>
                                </TabsTrigger>
                                <TabsTrigger value="razorpay" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                                    <span className="font-bold text-xs">RAZORPAY</span>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="stripe">
                               <StripeForm 
                                 amount={amountInCents} 
                                 onInitiatePayment={handleInitiatePayment}
                                 onSuccess={handleSuccess}
                                 onError={handleError}
                               />
                            </TabsContent>
                            <TabsContent value="paypal">
                                <PayPalButtonsWrapper 
                                  amount={amount} 
                                  onInitiatePayment={handleInitiatePayment}
                                  onSuccess={handleSuccess}
                                  onError={handleError}
                                />
                            </TabsContent>
                            <TabsContent value="razorpay">
                                <RazorpayButton 
                                  amount={amountInCents} 
                                  onInitiatePayment={handleInitiatePayment}
                                  onSuccess={handleSuccess}
                                  onError={handleError}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
                <div className="mt-6 flex items-center justify-center gap-4 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                    <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> PCI-DSS Compliant</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> End-to-end Encrypted</span>
                </div>
            </div>
        </div>
    )
}
