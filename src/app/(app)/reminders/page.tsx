
'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/shared/data-table';
import { columns } from './components/columns';
import { ScheduleReminderDialog } from './components/schedule-reminder-dialog';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Reminder, Contact, ReminderWithContact } from '@/lib/types';
import { useMemo } from 'react';

export default function RemindersPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const remindersQuery = useMemoFirebase(() =>
    user ? query(collection(firestore, 'reminders'), where('userId', '==', user.uid)) : null,
    [firestore, user]
  );
  
  const { data: reminders, isLoading: isLoadingReminders } = useCollection<Reminder>(remindersQuery);

  const contactsQuery = useMemoFirebase(() =>
    user ? query(collection(firestore, 'contacts'), where('userId', '==', user.uid)) : null,
    [firestore, user]
  );

  const { data: contacts, isLoading: isLoadingContacts } = useCollection<Contact>(contactsQuery);

  const remindersWithContacts = useMemo((): ReminderWithContact[] => {
    if (!reminders || !contacts) return [];
    
    const contactsMap = new Map(contacts.map(c => [c.id, c]));
    
    return reminders.map(reminder => {
      const contact = contactsMap.get(reminder.contactId);
      return {
        ...reminder,
        contact: contact ? { id: contact.id, name: contact.name, avatarUrl: contact.avatarUrl } : { id: 'unknown', name: 'Unknown Contact', avatarUrl: '' },
      };
    });
  }, [reminders, contacts]);
  
  const isLoading = isLoadingReminders || isLoadingContacts;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold tracking-tight">
            Reminders
          </h1>
          <p className="text-muted-foreground">
            Schedule and manage your automated follow-ups.
          </p>
        </div>
        <ScheduleReminderDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule Reminder
          </Button>
        </ScheduleReminderDialog>
      </div>

      <DataTable columns={columns} data={remindersWithContacts ?? []} isLoading={isLoading} />
    </div>
  );
}
