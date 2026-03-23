'use client'

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpRight, QrCode, User, Repeat, Wallet, CameraOff, AlertCircle, Upload, Zap, Search } from "lucide-react"
import { SmartSuggestions } from "./smart-suggestions"
import { RecentTransactions } from "./recent-transactions"
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

export default function DashboardPage() {
  const { toast } = useToast();
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [userName, setUserName] = useState('');
  
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            if (user && user.fullName) {
                setUserName(user.fullName);
            }
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
        }
    }
  }, []);

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
                    description: 'Please enable camera permissions in your browser settings to use PayMate 2.0 QR features.',
                });
            }
        };
        getCameraPermission();
    } else {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
  }, [isQrDialogOpen, toast]);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate high-speed AI processing
    setTimeout(() => {
        toast({
            title: 'QR Recognized!',
            description: 'Payment details extracted successfully.',
            variant: 'success'
        });
        setUpiId('fast-scan-99@paymate');
        setAmount('499');
        setIsQrDialogOpen(false);
        setIsScanning(false);
    }, 1200);
  };

  const handleUploadClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
          setIsScanning(true);
          const file = event.target.files[0];
          setTimeout(() => {
              toast({
                  title: 'Image Processed',
                  description: `Found UPI ID in "${file.name}".`,
                  variant: 'success'
              });
              setUpiId('image-scan-88@paymate');
              setAmount('899');
              setIsQrDialogOpen(false);
              setIsScanning(false);
          }, 1000);
      }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">PayMate 2.0</h1>
            <p className="text-muted-foreground">Welcome back, {userName}. Your finances are secured.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="bg-primary/10 px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                <Zap className="h-3 w-3" /> QUICK ACCESS
            </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-xl bg-gradient-to-br from-card to-card/50 border-primary/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Wallet className="h-32 w-32 rotate-12" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Available Balance</CardTitle>
                <CardDescription>Real-time consolidated view</CardDescription>
              </div>
              <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary"/>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tighter">₹75,430.50</span>
                <span className="text-success text-sm font-bold flex items-center gap-0.5"><ArrowUpRight className="h-3 w-3" /> 2.5%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">Quick Transfer</CardTitle>
              <CardDescription>Pay anyone instantly via UPI or Mobile Number.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="upi-id" className="text-xs font-bold uppercase text-muted-foreground">Recipient ID</Label>
                    <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input 
                        id="upi-id"
                        placeholder="ID or Mobile" 
                        className="pl-9 h-12 bg-muted/30 border-none focus-visible:ring-primary" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                    />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="amount" className="text-xs font-bold uppercase text-muted-foreground">Amount (₹)</Label>
                    <Input 
                    id="amount"
                    type="number" 
                    placeholder="0.00" 
                    className="h-12 bg-muted/30 border-none focus-visible:ring-primary" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="flex-1 h-12 text-md font-bold shadow-primary/20 shadow-lg hover:shadow-primary/40 transition-all" disabled={!upiId || !amount || parseFloat(amount) <= 0}>
                    <Link href={`/payment?amount=${amount}&recipient=${encodeURIComponent(upiId)}`}>
                    Initiate Transfer <ArrowUpRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>

                <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="lg" className="h-12 border-primary/20 hover:bg-primary/10 hover:text-primary">
                      <QrCode className="mr-2 h-5 w-5" />
                      Scan QR
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md border-primary/10 shadow-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><QrCode className="h-5 w-5 text-primary" /> PayMate 2.0 AI Scan</DialogTitle>
                        <DialogDescription>Auto-detection enabled. Place QR within frame.</DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col items-center justify-center space-y-4 pt-4">
                          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg" />
                          <div className="relative w-full aspect-square max-w-[300px] bg-muted rounded-2xl overflow-hidden border-4 border-muted flex items-center justify-center">
                              <video ref={videoRef} className={`w-full h-full object-cover transition-opacity duration-500 ${isScanning ? 'opacity-40 grayscale' : 'opacity-100'}`} autoPlay muted playsInline />
                              
                              {/* Scanning Overlay */}
                              {isQrDialogOpen && !isScanning && hasCameraPermission !== false && (
                                <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40">
                                    <div className="h-full w-full border-2 border-primary/50 relative">
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary" />
                                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary" />
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary" />
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary" />
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-primary/50 animate-[scan_2s_ease-in-out_infinite]" />
                                    </div>
                                </div>
                              )}

                              {isScanning && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm z-20">
                                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                                    <p className="font-bold text-primary animate-pulse tracking-widest uppercase text-xs">Processing AI Image...</p>
                                </div>
                              )}

                              {hasCameraPermission === false && (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-background/90 z-30">
                                      <CameraOff className="h-16 w-16 text-destructive mb-4"/>
                                      <p className="font-bold text-destructive uppercase tracking-widest text-sm">Security Block</p>
                                      <p className="text-xs text-muted-foreground mt-2">Camera access is disabled in browser settings.</p>
                                  </div>
                              )}
                          </div>
                      </div>
                      <DialogFooter className="sm:justify-between flex-row gap-2">
                        <Button variant="ghost" onClick={handleUploadClick} disabled={isScanning} className="text-xs font-bold uppercase tracking-widest">
                            <Upload className="mr-2 h-4 w-4" />
                            Gallery
                        </Button>
                        <Button className="flex-1 font-bold h-11" disabled={!hasCameraPermission || isScanning} onClick={handleScan}>
                            {isScanning ? <Loader2 className="animate-spin" /> : 'Simulate QR Scan'}
                        </Button>
                      </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="pt-4 border-t border-primary/5">
                <Button variant="ghost" className="w-full text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                    <Repeat className="mr-2 h-3 w-3" /> VIEW SAVED PAYEES & FAVORITES
                </Button>
              </div>
            </CardContent>
          </Card>

           <SmartSuggestions />
        </div>

        <div className="lg:col-span-1">
          <RecentTransactions />
        </div>
      </div>
      <style jsx global>{`
        @keyframes scan {
            0%, 100% { top: 0%; }
            50% { top: 100%; }
        }
        @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
