
'use client';

import { DataTable } from '@/components/shared/data-table';
import { columns } from './components/columns';
import { useCollection, useFirebase, useMemoFirebase, useUser } from '@/firebase';
import type { HistoryLog } from '@/lib/types';
import { collection, query, orderBy, where } from 'firebase/firestore';


export default function HistoryPage() {
  const { firestore } = useFirebase();
  const { user } = useUser();

  const historyQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'historyLogs'), where('userId', '==', user.uid), orderBy('sentAt', 'desc'));
  }, [firestore, user]);

  const { data: history, isLoading } = useCollection<HistoryLog>(historyQuery);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold tracking-tight">
            Reminder History
          </h1>
          <p className="text-muted-foreground">
            A log of all your sent follow-ups.
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={history || []} isLoading={isLoading}/>
    </div>
  );
}
