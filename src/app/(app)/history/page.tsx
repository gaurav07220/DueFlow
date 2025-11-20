
'use client';

import { DataTable } from '@/components/shared/data-table';
import { columns } from './components/columns';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Reminder, Contact, ReminderWithContact } from '@/lib/types';
import { useMemo } from 'react';

export default function HistoryPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  // 1. Fetch all reminders for the user
  const remindersQuery = useMemoFirebase(() =>
    user ? query(collection(firestore, 'reminders'), where('userId', '==', user.uid)) : null,
    [firestore, user]
  );
  const { data: reminders, isLoading: isLoadingReminders } = useCollection<Reminder>(remindersQuery);

  // 2. Fetch all contacts for the user
  const contactsQuery = useMemoFirebase(() =>
    user ? query(collection(firestore, 'contacts'), where('userId', '==', user.uid)) : null,
    [firestore, user]
  );
  const { data: contacts, isLoading: isLoadingContacts } = useCollection<Contact>(contactsQuery);

  // 3. Join and filter data to create the history log
  const historyLog = useMemo((): ReminderWithContact[] => {
    if (!reminders || !contacts) return [];
    
    const contactsMap = new Map(contacts.map(c => [c.id, c]));
    
    return reminders
      .filter(reminder => reminder.status !== 'pending') // Filter for completed reminders
      .map(reminder => {
        const contact = contactsMap.get(reminder.contactId);
        return {
          ...reminder,
          // Ensure a fallback contact object is always present
          contact: contact 
            ? { id: contact.id, name: contact.name, avatarUrl: contact.avatarUrl } 
            : { id: 'unknown', name: 'Unknown Contact', avatarUrl: '' },
        };
      })
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()); // Sort by most recent
  }, [reminders, contacts]);
  
  const isLoading = isLoadingReminders || isLoadingContacts;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold tracking-tight">
            Reminder History
          </h1>
          <p className="text-muted-foreground">
            A log of all your sent, paid, and failed follow-ups.
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={historyLog} isLoading={isLoading}/>
    </div>
  );
}
