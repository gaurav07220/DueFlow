
'use client';

import { useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  doc,
} from 'firebase/firestore';
import { sendReminderEmail } from '@/services/email-service';
import type { Reminder } from '@/lib/types';

// This component is designed to be invisible and runs in the background.
export function ReminderProcessor() {
  const firestore = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    if (!user || !firestore) return;

    // Function to check for and process overdue reminders
    const processOverdueReminders = async () => {
      console.log('Checking for overdue reminders...');
      
      // Query for reminders that are pending for the current user
      const q = query(
        collection(firestore, 'reminders'),
        where('userId', '==', user.uid),
        where('status', '==', 'pending')
      );

      try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          console.log('No pending reminders found.');
          return;
        }

        const now = new Date();
        const batch = writeBatch(firestore);
        let overdueCount = 0;

        // We need to fetch contacts to get their email addresses
        const contactsQuery = query(collection(firestore, 'contacts'), where('userId', '==', user.uid));
        const contactsSnapshot = await getDocs(contactsQuery);
        const contactsMap = new Map(contactsSnapshot.docs.map(doc => [doc.id, doc.data()]));

        // Filter for overdue reminders on the client side
        querySnapshot.forEach((document) => {
          const reminder = document.data() as Reminder;
          const scheduledAt = new Date(reminder.scheduledAt);

          if (scheduledAt <= now) {
            console.log(`Processing reminder: ${document.id}`);
            const contact = contactsMap.get(reminder.contactId);
            
            if (contact) {
              // Simulate sending the email
              sendReminderEmail({
                to: contact.email,
                name: contact.name,
                message: reminder.message,
                channel: reminder.channel,
              });
            } else {
              console.warn(`Contact not found for reminder ${document.id}. Cannot send email.`);
            }

            const reminderRef = doc(firestore, 'reminders', document.id);
            batch.update(reminderRef, { status: 'sent' });
            overdueCount++;
          }
        });

        if (overdueCount > 0) {
          await batch.commit();
          console.log(`Successfully processed ${overdueCount} reminders.`);
        } else {
          console.log('No overdue reminders to process.');
        }

      } catch (error) {
        console.error('Error processing reminders:', error);
      }
    };

    // Run the check immediately on load, and then set up an interval
    processOverdueReminders();
    const intervalId = setInterval(processOverdueReminders, 30000); // Check every 30 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [firestore, user]);

  // This component renders nothing in the UI
  return null;
}
