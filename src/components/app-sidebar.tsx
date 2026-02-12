'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

const menuItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/transfer', label: 'Transfer', icon: Send },
  { href: '/bills', label: 'Bills & Recharges', icon: Receipt },
  { href: '/history', label: 'History', icon: History },
  { href: '/support', label: 'Support', icon: MessageSquare },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = React.useState('User');

  React.useEffect(() => {
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

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 p-2">
            <div className="p-2.5 rounded-lg bg-primary text-primary-foreground">
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
                className="justify-start"
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
                <SidebarMenuButton variant="ghost" className="justify-start">
                    <UserCircle/>
                    <span>{userName}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild variant="ghost" className="justify-start text-destructive hover:text-destructive">
                    <Link href="/login">
                        <LogOut/>
                        <span>Logout</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
