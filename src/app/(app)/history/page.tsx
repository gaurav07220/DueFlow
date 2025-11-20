import { mockHistory } from '@/lib/mock-data';
import { DataTable } from '@/components/shared/data-table';
import { columns } from './components/columns';

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-headline font-bold tracking-tight">
          Reminder History
        </h1>
        <p className="text-muted-foreground">
          A log of all your sent follow-ups.
        </p>
      </div>

      <DataTable columns={columns} data={mockHistory} />
    </div>
  );
}
