
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


type CancelReminderDialogProps = {
  reminderId: string;
  children: React.ReactNode;
};

export function CancelReminderDialog({ reminderId, children }: CancelReminderDialogProps) {
  const { toast } = useToast();

  function handleCancel() {
    console.log('Canceling reminder:', reminderId);
    toast({
      title: 'Reminder Canceled',
      description: 'The scheduled reminder has been successfully canceled.',
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
