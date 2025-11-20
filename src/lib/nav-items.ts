
import {
  LayoutDashboard,
  Users,
  BellRing,
  History,
  CreditCard,
  HelpCircle,
} from 'lucide-react';
import type { NavItem } from './types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Contacts',
    href: '/contacts',
    icon: Users,
  },
  {
    title: 'Reminders',
    href: '/reminders',
    icon: BellRing,
  },
  {
    title: 'History',
    href: '/history',
    icon: History,
  },
  {
    title: 'Pricing',
    href: '/pricing',
    icon: CreditCard,
  },
  {
    title: 'Help',
    href: '/help',
    icon: HelpCircle,
  },
];
