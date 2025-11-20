
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Reminder } from '@/lib/types';
import { format } from 'date-fns';
import { Calendar, User, MessageCircle, Tag } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';


type ViewReminderDialogProps = {
  reminder: Reminder;
  children: React.ReactNode;
};

export function ViewReminderDialog({ reminder, children }: ViewReminderDialogProps) {
    const [open, setOpen] = React.useState(false);
    
    const scheduledAtDate = reminder.scheduledAt instanceof Timestamp ? reminder.scheduledAt.toDate() : new Date(reminder.scheduledAt);
  
    return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90vw] max-w-md rounded-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline">Reminder Details</DialogTitle>
          <DialogDescription>
            Viewing details for the reminder scheduled for {reminder.contact.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 overflow-y-auto flex-1 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden pr-4">
            <div className="flex items-start gap-4">
                <User className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                    <h4 className="font-semibold">Contact</h4>
                    <p className="text-muted-foreground">{reminder.contact.name}</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                    <h4 className="font-semibold">Scheduled At</h4>
                    <p className="text-muted-foreground">{format(scheduledAtDate, "PPP 'at' p")}</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <Tag className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                    <h4 className="font-semibold">Channel & Status</h4>
                    <div className='flex items-center gap-2'>
                        <p className="text-muted-foreground">{reminder.channel}</p>
                        <Badge
                        variant={reminder.status === 'sent' ? 'secondary' : reminder.status === 'pending' ? 'outline' : 'destructive'}
                        className={cn(
                            'text-xs',
                            reminder.status === 'sent' && 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300',
                            reminder.status === 'pending' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300',
                        )}
                        >
                        {reminder.status}
                        </Badge>
                    </div>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <MessageCircle className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                    <h4 className="font-semibold">Message</h4>
                    <p className="text-muted-foreground bg-secondary/50 p-3 rounded-md border border-border/50">{reminder.message}</p>
                </div>
            </div>
        </div>
        <Button onClick={() => setOpen(false)} variant="outline" className='mt-4'>Close</Button>
      </DialogContent>
    </Dialog>
  );
}
