'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, PanelLeft } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { navItems } from '@/lib/nav-items';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { mockUser } from '@/lib/mock-data';

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setOpenMobile(false)}
            >
                <PanelLeft />
                <span className="sr-only">Close Sidebar</span>
            </Button>
            <Package className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold font-headline">FollowPilot</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  variant="default"
                  className={cn(
                    'w-full',
                    pathname === item.href && 'bg-sidebar-accent text-sidebar-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-md p-2 hover:bg-sidebar-accent">
          <Avatar className="h-9 w-9">
            <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
            <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm truncate">
            <span className="font-semibold text-sidebar-foreground">{mockUser.name}</span>
            <span className="text-sidebar-foreground/70">{mockUser.email}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
