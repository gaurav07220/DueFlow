import { HistoryLog, Reminder, Contact, User, SubscriptionPlan } from './types';

export const mockUser: User = {
  id: 'user-01',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  subscription: 'pro',
};

export const mockContacts: Contact[] = [
  {
    id: 'contact-01',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1-555-0101',
    status: 'active',
    lastContacted: new Date('2023-10-22T10:00:00Z'),
    createdAt: new Date('2023-01-15T09:00:00Z'),
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026701d',
  },
  {
    id: 'contact-02',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1-555-0102',
    status: 'active',
    lastContacted: new Date('2023-10-20T14:30:00Z'),
    createdAt: new Date('2023-02-20T11:00:00Z'),
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026702d',
  },
  {
    id: 'contact-03',
    name: 'Peter Jones',
    email: 'peter.jones@example.com',
    phone: '+1-555-0103',
    status: 'inactive',
    lastContacted: new Date('2023-09-05T16:45:00Z'),
    createdAt: new Date('2023-03-10T13:20:00Z'),
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026703d',
  },
  {
    id: 'contact-04',
    name: 'Mary Johnson',
    email: 'mary.johnson@example.com',
    phone: '+1-555-0104',
    status: 'active',
    lastContacted: new Date('2023-10-25T08:00:00Z'),
    createdAt: new Date('2023-04-01T18:00:00Z'),
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
    {
    id: 'contact-05',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+1-555-0105',
    status: 'active',
    lastContacted: new Date('2023-10-24T11:20:00Z'),
    createdAt: new Date('2023-05-12T10:10:00Z'),
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
  },
];

export const mockReminders: Reminder[] = [
  {
    id: 'rem-01',
    contact: { id: 'contact-01', name: 'John Smith', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026701d' },
    channel: 'Email',
    message: 'Just following up on our last conversation. Let me know if you have any questions.',
    scheduledAt: new Date('2025-11-22T16:00:00Z'),
    status: 'pending',
  },
  {
    id: 'rem-02',
    contact: { id: 'contact-02', name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026702d' },
    channel: 'SMS',
    message: 'Hi Jane, hope you are having a great week!',
    scheduledAt: new Date('2025-11-21T10:30:00Z'),
    status: 'pending',
  },
  {
    id: 'rem-03',
    contact: { id: 'contact-04', name: 'Mary Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    channel: 'WhatsApp',
    message: 'Quick check-in about the proposal we discussed.',
    scheduledAt: new Date('2024-07-19T12:00:00Z'),
    status: 'sent',
  },
];

export const mockHistory: HistoryLog[] = [
    {
        id: 'hist-01',
        reminderId: 'rem-03',
        contactName: 'Mary Johnson',
        channel: 'WhatsApp',
        sentAt: new Date('2024-07-19T12:00:00Z'),
        status: 'seen',
        details: 'Message delivered and seen by contact.',
    },
    {
        id: 'hist-02',
        reminderId: 'rem-prev-01',
        contactName: 'John Smith',
        channel: 'Email',
        sentAt: new Date('2024-07-15T18:00:00Z'),
        status: 'replied',
        details: 'Contact replied to the email.',
    },
    {
        id: 'hist-03',
        reminderId: 'rem-prev-02',
        contactName: 'Peter Jones',
        channel: 'SMS',
        sentAt: new Date('2024-07-10T14:00:00Z'),
        status: 'failed',
        details: 'SMS delivery failed. Invalid phone number.',
    },
    {
        id: 'hist-04',
        reminderId: 'rem-prev-03',
        contactName: 'Jane Doe',
        channel: 'Email',
        sentAt: new Date('2024-07-18T11:00:00Z'),
        status: 'delivered',
        details: 'Email delivered successfully.',
    }
]

export const dashboardStats = {
    totalReminders: 58,
    sentReminders: 35,
    pendingReminders: 23,
    conversions: 12,
};

export const remindersChartData = [
  { name: 'Jan', total: 420 },
  { name: 'Feb', total: 380 },
  { name: 'Mar', total: 550 },
  { name: 'Apr', total: 490 },
  { name: 'May', total: 620 },
  { name: 'Jun', total: 580 },
  { name: 'Jul', total: 670 },
  { name: 'Aug', total: 640 },
  { name: 'Sep', total: 710 },
  { name: 'Oct', total: 750 },
  { name: 'Nov', total: 720 },
  { name: 'Dec', total: 800 },
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    name: 'Free',
    price: '$0',
    pricePeriod: '/ month',
    features: ['10 Reminders/month', 'Basic Analytics', 'Email Support'],
    cta: 'Current Plan',
  },
  {
    name: 'Pro',
    price: '$29',
    pricePeriod: '/ month',
    features: ['500 Reminders/month', 'Advanced Analytics', 'CSV/Excel Import', 'Priority Support'],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    pricePeriod: '/ month',
    features: ['Unlimited Reminders', 'Dedicated Account Manager', 'API Access', '24/7 Support'],
    cta: 'Contact Sales',
  },
];