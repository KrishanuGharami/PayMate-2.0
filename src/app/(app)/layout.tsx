
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';

const IDLE_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes for Phase II
const WARNING_TIMEOUT_MS = 2 * 60 * 1000; // 2 minute warning

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useUser();
  const auth = useAuth();
  const [isIdle, setIsIdle] = useState(false);
  
  const handleLogout = useCallback(async () => {
    await auth.signOut();
    router.push('/login');
  }, [auth, router]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    let idleTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;

    const resetTimers = () => {
      clearTimeout(idleTimer);
      clearTimeout(warningTimer);
      setIsIdle(false);

      warningTimer = setTimeout(() => {
        setIsIdle(true);
      }, IDLE_TIMEOUT_MS - WARNING_TIMEOUT_MS);

      idleTimer = setTimeout(() => {
        handleLogout();
      }, IDLE_TIMEOUT_MS);
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimers));
    
    resetTimers();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimers));
      clearTimeout(idleTimer);
      clearTimeout(warningTimer);
    };
  }, [handleLogout, user]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium animate-pulse text-muted-foreground">Initializing PayMate Security Engine...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-gradient-to-br from-background to-background-end">
        {children}
      </SidebarInset>

       <AlertDialog open={isIdle}>
        <AlertDialogContent className="border-primary/20 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Security Check: Still there?</AlertDialogTitle>
            <AlertDialogDescription>
              You've been inactive for a while. To protect your financial data, we'll automatically sign you out shortly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={handleLogout}>Sign Out Now</Button>
            <AlertDialogAction onClick={() => setIsIdle(false)} className="bg-primary hover:bg-primary/90">Stay Signed In</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
