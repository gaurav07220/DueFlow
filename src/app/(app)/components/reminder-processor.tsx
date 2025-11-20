
'use client';

import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, updateDoc, addDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import type { Reminder, Contact } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

export function ReminderProcessor() {
  const { user } = useUser();
  const firestore = useFirestore();

  const pendingRemindersQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'reminders'), where('userId', '==', user.uid), where('status', '==', 'pending')) : null,
    [firestore, user]
  );
  
  const { data: pendingReminders } = useCollection<Reminder>(pendingRemindersQuery);

  const contactsQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'contacts'), where('userId', '==', user.uid)) : null,
    [firestore, user]
  );
  const { data: contacts } = useCollection<Contact>(contactsQuery);

  useEffect(() => {
    if (!pendingReminders || !contacts || !firestore || !user) return;

    const contactsMap = new Map(contacts.map(c => [c.id, c]));
    
    const processOverdueReminders = async () => {
      const now = new Date(); // Moved this line inside the function
      for (const reminder of pendingReminders) {
        if (new Date(reminder.scheduledAt) <= now) {
          try {
            const contact = contactsMap.get(reminder.contactId);
            if (!contact) {
                console.warn(`Contact not found for reminder ${reminder.id}, skipping.`);
                continue;
            }

            if (reminder.channel === 'Email') {
                const mailCollection = collection(firestore, 'mail');
                await addDoc(mailCollection, {
                    to: [contact.email],
                    message: {
                        subject: `Reminder for ${contact.name}`,
                        html: reminder.message,
                    },
                });
            } else if (reminder.channel === 'SMS' || reminder.channel === 'WhatsApp') {
              // SIMULATE sending SMS or WhatsApp. In a real app, this would be a call to a backend function.
              console.log('--- SIMULATING MESSAGE SEND ---');
              console.log(`Channel: ${reminder.channel}`);
              console.log(`To: ${contact.phone} (${contact.name})`);
              console.log(`Message: "${reminder.message}"`);
              console.log('-----------------------------');
            }

            const reminderRef = doc(firestore, 'reminders', reminder.id);
            await updateDoc(reminderRef, { status: 'sent' });

          } catch (error: any) {
            console.error(`Failed to process reminder ${reminder.id}:`, error);
            const contactName = contactsMap.get(reminder.contactId)?.name || 'an unknown contact';
            toast({
                variant: 'destructive',
                title: 'Reminder Processing Error',
                description: `Could not process a reminder for ${contactName}.`,
            });
          }
        }
      }
    };

    const intervalId = setInterval(() => {
        processOverdueReminders();
    }, 60000); // Check every 60 seconds

    // Initial check on load
    processOverdueReminders();

    return () => clearInterval(intervalId);

  }, [pendingReminders, contacts, firestore, user, toast]);

  return null; // This component does not render anything
}
