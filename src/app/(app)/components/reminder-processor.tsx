'use client';

import { useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from 'firebase/firestore';

// This component is designed to be invisible and runs in the background.
export function ReminderProcessor() {
  const firestore = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    if (!user || !firestore) return;

    // Function to check for and process overdue reminders
    const processOverdueReminders = async () => {
      console.log('Checking for overdue reminders...');
      const now = new Date().toISOString();
      
      // Query for reminders that are pending and scheduled for a time in the past
      const q = query(
        collection(firestore, 'reminders'),
        where('userId', '==', user.uid),
        where('status', '==', 'pending'),
        where('scheduledAt', '<=', now)
      );

      try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          console.log('No overdue reminders found.');
          return;
        }

        // Use a batch to update all found reminders in a single operation
        const batch = writeBatch(firestore);
        querySnapshot.forEach((doc) => {
          console.log(`Processing reminder: ${doc.id}`);
          batch.update(doc.ref, { status: 'sent' });
        });

        await batch.commit();
        console.log(`Successfully processed ${querySnapshot.size} reminders.`);

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
