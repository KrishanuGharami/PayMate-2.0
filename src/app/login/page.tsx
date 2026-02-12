'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Wallet, ShieldCheck } from 'lucide-react';
import React from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"


const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isMfaOpen, setIsMfaOpen] = React.useState(false);
  const [otpValue, setOtpValue] = React.useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (
        user.email === values.email &&
        user.password === values.password
      ) {
        // Instead of logging in directly, open MFA dialog
        setIsMfaOpen(true);
      } else {
        toast({
          title: 'Invalid Credentials',
          description: 'Please check your email and password.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'No User Found',
        description: 'Please sign up to create an account.',
        variant: 'destructive',
      });
    }
  }

  function handleVerifyOtp() {
    // For this prototype, we'll use a hardcoded OTP.
    if (otpValue === '123456') {
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
        variant: 'success'
      });
      setIsMfaOpen(false);
      router.push('/dashboard');
    } else {
      toast({
        title: 'Invalid OTP',
        description: 'The one-time password you entered is incorrect.',
        variant: 'destructive',
      });
    }
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-background-end p-4">
        <Card className="w-full max-w-md mx-auto shadow-2xl bg-card/70 backdrop-blur-xl border-border/20">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-primary text-primary-foreground">
                <Wallet size={24} />
              </div>
              <h1 className="text-3xl font-bold text-primary">PayMate 2.0</h1>
            </div>
            <CardTitle className="text-2xl">Welcome Back!</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                          <FormLabel>Password</FormLabel>
                          <Link href="#" className="ml-auto inline-block text-sm underline">
                              Forgot your password?
                          </Link>
                      </div>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </CardContent>
            </form>
          </Form>
          <CardFooter className="text-center text-sm">
            <p className="w-full">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline font-semibold">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={isMfaOpen} onOpenChange={setIsMfaOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShieldCheck className="text-primary"/> Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              For your security, please enter the 6-digit code from your authenticator app. (Hint: 123456)
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center space-y-4 pt-4">
             <InputOTP maxLength={6} value={otpValue} onChange={(value) => setOtpValue(value)}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
          </div>
          <DialogFooter className="sm:justify-between flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsMfaOpen(false)}>Cancel</Button>
            <Button onClick={handleVerifyOtp} disabled={otpValue.length < 6}>Verify Code</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
