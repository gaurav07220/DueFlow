
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
import { useFirestore } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

type DeleteContactDialogProps = {
  contactId: string;
  children: React.ReactNode;
};

export function DeleteContactDialog({ contactId, children }: DeleteContactDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    if (!firestore) return;
    setIsDeleting(true);

    try {
        const contactRef = doc(firestore, 'contacts', contactId);
        await deleteDoc(contactRef);
        toast({
            title: 'Contact Deleted',
            description: 'The contact has been permanently removed.',
        });
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error Deleting Contact',
            description: error.message || 'There was a problem deleting the contact.',
        });
    } finally {
        setIsDeleting(false);
    }
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
          <AlertDialogAction 
            asChild
            onClick={handleDelete} 
          >
            <Button
                loading={isDeleting}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
             Yes, Delete Contact
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
