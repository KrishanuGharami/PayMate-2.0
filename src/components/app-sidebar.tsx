
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Home,
  Send,
  Receipt,
  History,
  MessageSquare,
  UserCircle,
  LogOut,
  Wallet,
  ShieldCheck,
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { useUser, useAuth } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';

const menuItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/transfer', label: 'Transfer', icon: Send },
  { href: '/bills', label: 'Bills & Recharges', icon: Receipt },
  { href: '/history', label: 'History', icon: History },
  { href: '/support', label: 'Support', icon: MessageSquare },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast({
        title: 'Signed Out',
        description: 'You have been securely logged out.',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 p-2">
            <div className="p-2.5 rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Wallet size={24} />
            </div>
            <h1 className="text-2xl font-bold text-primary group-data-[collapsible=icon]:hidden">PayMate 2.0</h1>
          </div>
          <div className="p-2 group-data-[collapsible=icon]:hidden">
            <ThemeToggle />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                className="justify-start data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                size="lg"
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarSeparator />
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton variant="ghost" className="justify-start h-auto py-2">
                    <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={user?.photoURL || ''} />
                        <AvatarFallback><UserCircle className="h-6 w-6" /></AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start overflow-hidden">
                        <span className="font-semibold truncate w-full">{user?.displayName || 'Secure User'}</span>
                        <span className="text-[10px] text-muted-foreground truncate w-full">{user?.email}</span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} variant="ghost" className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Secure Sign Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
