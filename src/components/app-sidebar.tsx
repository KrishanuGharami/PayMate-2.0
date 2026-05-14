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
  Wallet,
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { UserButton, useUser } from '@clerk/nextjs';

const menuItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/transfer', label: 'Transfer', icon: Send },
  { href: '/bills', label: 'Bills & Recharges', icon: Receipt },
  { href: '/history', label: 'History', icon: History },
  { href: '/support', label: 'Support', icon: MessageSquare },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

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
         <div className="p-3 flex items-center gap-3">
            <UserButton
              signInUrl="/login"
              appearance={{
                elements: {
                  avatarBox: 'h-10 w-10',
                },
              }}
            />
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium">{user?.fullName || 'User'}</p>
              <p className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
         </div>
      </SidebarFooter>
    </Sidebar>
  );
}

