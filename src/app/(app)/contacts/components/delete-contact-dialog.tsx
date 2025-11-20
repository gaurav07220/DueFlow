
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import React from 'react';
import { useFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useUser } from '@/firebase/provider';

type DeleteContactDialogProps = {
  contactId: string;
  children: React.ReactNode;
};

export function DeleteContactDialog({ contactId, children }: DeleteContactDialogProps) {
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const { user } = useUser();

  function handleDelete() {
    if (!firestore || !user) return;
    
    const contactDocRef = doc(firestore, 'contacts', contactId);
    
    deleteDocumentNonBlocking(contactDocRef)
      .then(() => {
        toast({
          title: 'Contact Deleted',
          description: 'The contact has been successfully deleted.',
        });
      })
      .catch((error: any) => {
         toast({
          variant: 'destructive',
          title: 'Error Deleting Contact',
          description: error.message,
        });
      });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the contact from your records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
            Yes, Delete Contact
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
