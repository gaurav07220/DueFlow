
'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/shared/data-table';
import { columns } from './components/columns';
import { ScheduleReminderDialog } from './components/schedule-reminder-dialog';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';

export default function RemindersPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const remindersQuery = useMemoFirebase(() =>
    user ? query(collection(firestore, 'reminders'), where('userId', '==', user.uid), orderBy('scheduledAt', 'desc')) : null,
    [firestore, user]
  );
  
  const { data: reminders, isLoading } = useCollection(remindersQuery);

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

      <DataTable columns={columns} data={reminders ?? []} isLoading={isLoading} />
    </div>
  );
}
