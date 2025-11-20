import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  subscription: 'free' | 'pro' | 'enterprise';
};

export type Contact = {
  id: string;
  name: string;
getEmail: () => string;
  getPhone: () => string;
  status: 'active' | 'inactive';
  lastContacted: Date;
  createdAt: Date;
  avatarUrl: string;
};

export type Reminder = {
  id: string;
  contact: Pick<Contact, 'id' | 'name' | 'avatarUrl'>;
  channel: 'Email' | 'SMS' | 'WhatsApp';
  message: string;
  scheduledAt: Date;
  status: 'pending' | 'sent' | 'failed';
};

export type HistoryLog = {
  id: string;
  reminderId: string;
  contactName: string;
  channel: 'Email' | 'SMS' | 'WhatsApp';
  sentAt: Date;
  status: 'delivered' | 'seen' | 'replied' | 'ignored' | 'failed';
  details: string;
};

export type SubscriptionPlan = {
  name: string;
  price: string;
  pricePeriod: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};
