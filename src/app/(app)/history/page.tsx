
'use client';

import { DataTable } from '@/components/shared/data-table';
import { columns } from './components/columns';
import { mockHistory } from '@/lib/mock-data';

export default function HistoryPage() {
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

      <DataTable columns={columns} data={mockHistory} isLoading={false}/>
    </div>
  );
}

    