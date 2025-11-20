
import type { Contact, Reminder, HistoryLog, SubscriptionPlan } from './types';
import { subDays, addDays, addHours } from 'date-fns';

const now = new Date();

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    phone: '+1-202-555-0182',
    status: 'active',
    lastContacted: subDays(now, 5).toISOString(),
    createdAt: subDays(now, 30).toISOString(),
    avatarUrl: 'https://i.pravatar.cc/150?u=alice',
  },
  {
    id: '2',
    name: 'Bob Williams',
    email: 'bob.w@example.com',
    phone: '+1-202-555-0191',
    status: 'active',
    lastContacted: subDays(now, 2).toISOString(),
    createdAt: subDays(now, 45).toISOString(),
    avatarUrl: 'https://i.pravatar.cc/150?u=bob',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    phone: '+1-202-555-0164',
    status: 'inactive',
    lastContacted: subDays(now, 60).toISOString(),
    createdAt: subDays(now, 90).toISOString(),
    avatarUrl: 'https://i.pravatar.cc/150?u=charlie',
  },
];

export const mockReminders: Reminder[] = [
  {
    id: 'r1',
    contact: { id: '1', name: 'Alice Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=alice' },
    channel: 'Email',
    message: 'Just following up on our meeting last week. Any updates?',
    scheduledAt: addDays(now, 2).toISOString(),
    status: 'pending',
  },
  {
    id: 'r2',
    contact: { id: '2', name: 'Bob Williams', avatarUrl: 'https://i.pravatar.cc/150?u=bob' },
    channel: 'SMS',
    message: 'Hi Bob, quick check-in about the proposal. Let me know your thoughts.',
    scheduledAt: addHours(now, 4).toISOString(),
    status: 'pending',
  },
  {
    id: 'r3',
    contact: { id: '1', name: 'Alice Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=alice' },
    channel: 'WhatsApp',
    message: 'Invoice for project X attached. Please confirm receipt.',
    scheduledAt: subDays(now, 1).toISOString(),
    status: 'sent',
  },
  {
    id: 'r4',
    contact: { id: '3', name: 'Charlie Brown', avatarUrl: 'https://i.pravatar.cc/150?u=charlie' },
    channel: 'Email',
    message: 'Follow up on payment for invoice #1234.',
    scheduledAt: subDays(now, 10).toISOString(),
    status: 'paid',
  },
];

export const mockHistory: HistoryLog[] = [
    {
        id: 'h1',
        reminderId: 'r3',
        contactName: 'Alice Johnson',
        channel: 'WhatsApp',
        sentAt: subDays(now, 1).toISOString(),
        status: 'delivered',
        details: 'Message sent successfully via provider.',
    },
    {
        id: 'h2',
        reminderId: 'r4',
        contactName: 'Charlie Brown',
        channel: 'Email',
        sentAt: subDays(now, 10).toISOString(),
        status: 'paid',
        details: 'User marked this reminder as paid manually.',
    },
    {
        id: 'h3',
        reminderId: 'r_old_1',
        contactName: 'David Miller',
        channel: 'SMS',
        sentAt: subDays(now, 15).toISOString(),
        status: 'failed',
        details: 'Provider error: Invalid phone number.',
    },
     {
        id: 'h4',
        reminderId: 'r_old_2',
        contactName: 'Eve Davis',
        channel: 'Email',
        sentAt: subDays(now, 20).toISOString(),
        status: 'replied',
        details: 'User replied to the email.',
    },
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    name: 'Free',
    price: '₹0',
    pricePeriod: '/month',
    features: [
      '10 reminders per month',
      'Email support',
      'Manage up to 25 contacts',
      'Basic reporting',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Growth',
    price: '₹999',
    pricePeriod: '/month',
    features: [
      '500 reminders per month',
      'Priority email support',
      'Manage up to 500 contacts',
      'Advanced reporting',
      'API access',
    ],
    cta: 'Upgrade to Growth',
    highlighted: true,
  },
  {
    name: 'Scale',
    price: '₹2499',
    pricePeriod: '/month',
    features: [
      'Unlimited reminders',
      '24/7 phone & email support',
      'Unlimited contacts',
      'Custom reporting',
      'Dedicated account manager',
    ],
    cta: 'Upgrade to Scale',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    pricePeriod: '',
    features: [
      'All features in Scale',
      'Custom integrations',
      'On-premise deployment option',
      'White-glove onboarding',
      'SLA guarantees',
    ],
    cta: 'Contact Sales',
  },
];

    