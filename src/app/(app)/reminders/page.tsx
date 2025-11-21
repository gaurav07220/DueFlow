
'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { DataTable } from '@/components/shared/data-table';
import { columns } from './components/columns';
import { ScheduleReminderDialog } from './components/schedule-reminder-dialog';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Reminder, Contact, ReminderWithContact } from '@/lib/types';
import React, { useMemo } from 'react';
import { Input } from '@/components/ui/input';

export default function RemindersPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = React.useState('');

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

  const filteredReminders = useMemo(() => {
    if (!remindersWithContacts) return [];
    return remindersWithContacts.filter(reminder => 
      reminder.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [remindersWithContacts, searchTerm]);
  
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
        <div className="flex items-center gap-2">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by contact or message..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <ScheduleReminderDialog>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Schedule Reminder
            </Button>
            </ScheduleReminderDialog>
        </div>
      </div>

      <DataTable columns={columns} data={filteredReminders ?? []} isLoading={isLoading} />
    </div>
  );
}
