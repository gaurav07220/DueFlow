
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  hidden?: boolean;
};

export type User = {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  businessName?: string;
  subscriptionStatus: 'free' | 'pro' | 'enterprise';
  createdAt: string;
}

export type Contact = {
  id: string;
  userId: string;
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
  userId: string;
  contactId: string;
  channel: 'Email' | 'SMS' | 'WhatsApp';
  message: string;
  scheduledAt: string;
  status: 'pending' | 'sent' | 'failed' | 'paid';
  amount?: number;
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

// This type is used for displaying reminders with their contact info joined.
export type ReminderWithContact = Reminder & {
  contact: Pick<Contact, 'id' | 'name' | 'avatarUrl'>;
};
