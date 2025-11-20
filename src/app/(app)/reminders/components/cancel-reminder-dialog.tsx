
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

type CancelReminderDialogProps = {
  reminderId: string;
  children: React.ReactNode;
};

export function CancelReminderDialog({ reminderId, children }: CancelReminderDialogProps) {
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const { user } = useUser();

  function handleCancel() {
    if (!firestore || !user) return;
    const reminderDocRef = doc(firestore, 'users', user.uid, 'reminders', reminderId);
    
    deleteDocumentNonBlocking(reminderDocRef)
      .then(() => {
        toast({
          title: 'Reminder Canceled',
          description: 'The scheduled reminder has been successfully canceled.',
        });
      })
      .catch((error) => {
        toast({
          variant: 'destructive',
          title: 'Error',
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
            This action cannot be undone. This will permanently cancel the scheduled reminder.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Back</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel} className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
            Yes, Cancel Reminder
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
