
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  hidden?: boolean;
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  lastContacted: string;
  createdAt: string;
  avatarUrl: string;
};

export type Reminder = {
  id: string;
  contact: Pick<Contact, 'id' | 'name' | 'avatarUrl'>;
  channel: 'Email' | 'SMS' | 'WhatsApp';
  message: string;
  scheduledAt: string;
  status: 'pending' | 'sent' | 'failed' | 'paid';
};

export type HistoryLog = {
  id: string;
  reminderId: string;
  contactName: string;
  channel: 'Email' | 'SMS' | 'WhatsApp' | 'System';
  sentAt: string;
  status: 'delivered' | 'seen' | 'replied' | 'ignored' | 'failed' | 'paid';
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

    