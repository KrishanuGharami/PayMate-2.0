'use client'

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpRight, QrCode, User, Repeat, Wallet, CameraOff, AlertCircle, Upload } from "lucide-react"
import { SmartSuggestions } from "./smart-suggestions"
import { RecentTransactions } from "./recent-transactions"
import { PaymentReminders } from "./payment-reminders"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useUser } from "@clerk/nextjs"

export default function DashboardPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (isQrDialogOpen) {
        const getCameraPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setHasCameraPermission(true);

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                toast({
                    variant: 'destructive',
                    title: 'Camera Access Denied',
                    description: 'Please enable camera permissions in your browser settings to use this app.',
                });
            }
        };
        getCameraPermission();
    } else {
        // Stop camera when dialog closes
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
  }, [isQrDialogOpen, toast]);

  const handleScan = () => {
    toast({
        title: 'QR Code Scanned!',
        description: 'UPI details have been filled in.',
        variant: 'success'
    });
    setUpiId('scanned-from-dash@paymate');
    setAmount('123');
    setIsQrDialogOpen(false);
  };

  const handleUploadClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          toast({
              title: 'QR Code Uploaded!',
              description: `File "${file.name}" selected. Simulating scan.`,
              variant: 'success'
          });
          setUpiId('uploaded-from-dash@paymate');
          setAmount('456');
          setIsQrDialogOpen(false);
      }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName || 'User'}!</h1>
        <p className="text-muted-foreground">Here&apos;s your financial overview for today.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Current Balance</CardTitle>
                <CardDescription>Your available funds</CardDescription>
              </div>
              <Wallet className="h-8 w-8 text-primary"/>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">₹75,430.50</p>
              <p className="text-sm text-muted-foreground mt-1">+2.5% from last month</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Send Money</CardTitle>
              <CardDescription>Quickly send money to your contacts or any UPI ID.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                 <Label htmlFor="upi-id">Recipient UPI ID</Label>
                <div className="relative flex-grow">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input 
                    id="upi-id"
                    placeholder="Enter UPI ID or Mobile Number" 
                    className="pl-10 h-11" 
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
              </div>
               <div className="space-y-2">
                 <Label htmlFor="amount">Amount (₹)</Label>
                 <Input 
                  id="amount"
                  type="number" 
                  placeholder="0.00" 
                  className="h-11" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  />
               </div>
              <Button asChild size="lg" className="w-full h-11" disabled={!upiId || !amount || parseFloat(amount) <= 0}>
                <Link href={`/payment?amount=${amount}&recipient=${encodeURIComponent(upiId)}`}>
                  Send <ArrowUpRight className="ml-2" />
                </Link>
              </Button>
              <div className="flex flex-col sm:flex-row gap-4">
                <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <QrCode className="mr-2" />
                      Scan QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Scan & Pay</DialogTitle>
                        <DialogDescription>Point your camera at a UPI QR code, or upload an image to pay.</DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col items-center justify-center space-y-4 pt-4">
                          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/gif" />
                          <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden border-2 border-dashed flex items-center justify-center">
                              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                              {hasCameraPermission === false && (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-background/80">
                                      <CameraOff className="h-16 w-16 text-destructive mb-4"/>
                                      <p className="font-semibold text-lg text-destructive">Camera Disabled</p>
                                      <p className="text-sm text-muted-foreground">Please grant camera permission in your browser.</p>
                                  </div>
                              )}
                          </div>
                           {hasCameraPermission === false && (
                              <Alert variant="destructive">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertTitle>Camera Access Required</AlertTitle>
                                  <AlertDescription>
                                      Please allow camera access to use this feature.
                                  </AlertDescription>
                              </Alert>
                           )}
                      </div>
                      <DialogFooter>
                        <div className="w-full flex flex-col sm:flex-row gap-4">
                          <Button className="w-full" disabled={!hasCameraPermission} onClick={handleScan}>
                              <QrCode className="mr-2 h-4 w-4" />
                              Simulate Scan
                          </Button>
                          <Button variant="outline" className="w-full" onClick={handleUploadClick}>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload QR Code
                          </Button>
                        </div>
                      </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" className="w-full">
                  <Repeat className="mr-2" />
                  Repeat Last Transaction
                </Button>
              </div>
            </CardContent>
          </Card>

           <SmartSuggestions />
           <PaymentReminders />
        </div>

        <div className="lg:col-span-1">
          <RecentTransactions />
        </div>
      </div>
    </div>
  )
}
