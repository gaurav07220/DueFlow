import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { mockReminders } from '@/lib/mock-data';
import { DataTable } from '@/components/shared/data-table';
import { columns } from './components/columns';
import { ScheduleReminderDialog } from './components/schedule-reminder-dialog';

export default function RemindersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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

      <DataTable columns={columns} data={mockReminders} />
    </div>
  );
}
