
'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle, Upload, Search } from 'lucide-react';
import { DataTable } from '@/components/shared/data-table';
import { columns } from './components/columns';
import { AddContactDialog } from './components/add-contact-dialog';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import React, { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import type { Contact } from '@/lib/types';

export default function ContactsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = React.useState('');

  const contactsQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'contacts'), where('userId', '==', user.uid)) : null,
    [firestore, user]
  );
  
  const { data: contacts, isLoading } = useCollection<Contact>(contactsQuery);

  const filteredContacts = useMemo(() => {
    if (!contacts) return [];
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contacts, searchTerm]);


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
        <div className="flex gap-2 items-center">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search contacts..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          <Button variant="outline" className='hidden sm:flex'>
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

      <DataTable columns={columns} data={filteredContacts} isLoading={isLoading} />
    </div>
  );
}
