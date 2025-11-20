import { Button } from '@/components/ui/button';
import { PlusCircle, Upload } from 'lucide-react';
import { mockContacts } from '@/lib/mock-data';
import { DataTable } from '@/components/shared/data-table';
import { columns } from './components/columns';
import { AddContactDialog } from './components/add-contact-dialog';

export default function ContactsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-headline font-bold tracking-tight">
            Contacts
          </h1>
          <p className="text-muted-foreground">
            Manage your leads and clients.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <AddContactDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </AddContactDialog>
        </div>
      </div>

      <DataTable columns={columns} data={mockContacts} />
    </div>
  );
}
