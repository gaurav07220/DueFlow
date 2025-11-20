
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
  addDoc,
} from 'firebase/firestore';
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
        
        const mailCollection = collection(firestore, 'mail');

        // Filter for overdue reminders on the client side
        for (const document of querySnapshot.docs) {
          const reminder = document.data() as Reminder;
          const scheduledAt = new Date(reminder.scheduledAt);

          if (scheduledAt <= now) {
            console.log(`Processing reminder: ${document.id}`);
            const contact = contactsMap.get(reminder.contactId);
            
            if (contact) {
              // Create a mail document in the 'mail' collection
              // This is the pattern used by the "Trigger Email" Firebase Extension
              await addDoc(mailCollection, {
                to: [contact.email],
                message: {
                  subject: `A reminder for ${contact.name}`,
                  html: `Hi ${contact.name},<br><br>This is a reminder about the following: <br><br><i>${reminder.message}</i>`,
                },
              });

              const reminderRef = doc(firestore, 'reminders', document.id);
              batch.update(reminderRef, { status: 'sent' });
              overdueCount++;

            } else {
              console.warn(`Contact not found for reminder ${document.id}. Cannot send email.`);
              const reminderRef = doc(firestore, 'reminders', document.id);
              batch.update(reminderRef, { status: 'failed' });
            }
          }
        }

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
    const intervalId = setInterval(processOverdueReminders, 60000); // Check every 60 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [firestore, user]);

  // This component renders nothing in the UI
  return null;
}
