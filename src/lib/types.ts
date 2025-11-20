
import type { LucideIcon } from "lucide-react";
import type { Timestamp } from "firebase/firestore";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  hidden?: boolean;
};

export type User = {
  id: string;
  name: string;
  businessName: string;
  email: string;
  avatarUrl: string;
  subscription: 'free' | 'pro' | 'enterprise';
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  lastContacted: Date | Timestamp;
  createdAt: Date | Timestamp;
  avatarUrl: string;
};

export type Reminder = {
  id: string;
  contact: Pick<Contact, 'id' | 'name' | 'avatarUrl'>;
  channel: 'Email' | 'SMS' | 'WhatsApp';
  message: string;
  scheduledAt: Date | Timestamp;
  status: 'pending' | 'sent' | 'failed' | 'paid';
};

export type HistoryLog = {
  id: string;
  reminderId: string;
  contactName: string;
  channel: 'Email' | 'SMS' | 'WhatsApp' | 'System';
  sentAt: Date | Timestamp;
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
