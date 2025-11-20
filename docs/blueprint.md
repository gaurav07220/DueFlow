# **App Name**: FollowPilot

## Core Features:

- User Authentication: Secure user authentication with email and Google login via Firebase Authentication.
- Contact Management: Add, import (CSV/Excel), and manage contacts/leads. Uses Firestore.
- Reminder Scheduling: Schedule new reminders for WhatsApp, SMS, and Email for specific dates/times.
- Automated Follow-ups: Send automated follow-up reminders via WhatsApp (API placeholder), SMS (Twilio API placeholder), and Email (SendGrid API placeholder). Uses Firestore and Firebase Cloud Functions.
- Status Tracking: Store contact status (seen/replied/ignored) for each reminder. Uses Firestore.
- Analytics Dashboard: Display total reminders, sent reminders, pending reminders, and conversions in a dashboard. Uses Firestore.
- Subscription Paywall: Integrate Stripe/Razorpay for subscription payments and restrict sending reminders based on active plan.

## Style Guidelines:

- Primary color: Deep purple (#673AB7) to convey sophistication and reliability, reflecting the app's ability to drive revenue. 
- Background color: Very light gray (#F5F5F5), for a clean background that lets the purple accents stand out without causing harsh contrast.
- Accent color: A light, contrasting purple (#D81B60). Its vivid shade should be reserved for attracting attention to special UI elements. 
- Font pairing: 'Poppins' (sans-serif) for headlines and 'PT Sans' (sans-serif) for body text, ensuring a clean and readable interface. 
- Modern, mobile-responsive layout with a sidebar navigation (Dashboard, Contacts, Reminders, History, Pricing/Upgrade, Help).
- Consistent, professional icons for sidebar navigation and key actions, enhancing user experience.
- Subtle transitions and animations to provide feedback on user interactions, like submitting a new contact.