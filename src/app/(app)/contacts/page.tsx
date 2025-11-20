
'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle, Upload } from 'lucide-react';
import { DataTable } from '@/components/shared/data-table';
import { columns } from './components/columns';
import { AddContactDialog } from './components/add-contact-dialog';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Contact } from '@/lib/types';
import { useUser } from '@/firebase/provider';

export default function ContactsPage() {
  const { firestore } = useFirebase();
  const { user } = useUser();

  const contactsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'contacts'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: contacts, isLoading } = useCollection<Contact>(contactsQuery);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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

      <DataTable columns={columns} data={contacts || []} isLoading={isLoading} />
    </div>
  );
}
