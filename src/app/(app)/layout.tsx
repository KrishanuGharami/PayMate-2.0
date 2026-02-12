'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const WARNING_TIMEOUT_MS = 1 * 60 * 1000; // 1 minute warning

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isIdle, setIsIdle] = useState(false);
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    router.push('/login');
  }, [router]);

  useEffect(() => {
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
  }, [handleLogout]);


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-gradient-to-br from-background to-background-end">
        {children}
      </SidebarInset>

       <AlertDialog open={isIdle}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you still there?</AlertDialogTitle>
            <AlertDialogDescription>
              You've been inactive for a while. For your security, you will be logged out automatically soon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
            <AlertDialogAction onClick={() => setIsIdle(false)}>Stay Signed In</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
