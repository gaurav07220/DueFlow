
'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Reminder } from '@/lib/types';
import { cn, getInitials } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { format, formatDistanceToNow } from 'date-fns';
import { Mail, MessageSquare, MoreHorizontal, Phone, Trash, Edit, Eye, CheckCircle } from 'lucide-react';
import React from 'react';
import { ScheduleReminderDialog } from './schedule-reminder-dialog';
import { ViewReminderDialog } from './view-reminder-dialog';
import { CancelReminderDialog } from './cancel-reminder-dialog';
import { useToast } from '@/hooks/use-toast';

const channelIcons = {
  Email: Mail,
  SMS: MessageSquare,
  WhatsApp: Phone,
};

const ScheduledAtCell = ({ scheduledAt }: { scheduledAt: Date }) => {
    const [formattedDate, setFormattedDate] = React.useState('');
    const [relativeTime, setRelativeTime] = React.useState('');
  
    React.useEffect(() => {
      setFormattedDate(format(scheduledAt, 'MMM d, yyyy, p'));
      setRelativeTime(formatDistanceToNow(scheduledAt, { addSuffix: true }));
       const interval = setInterval(() => {
        setRelativeTime(formatDistanceToNow(scheduledAt, { addSuffix: true }));
      }, 60000);
      return () => clearInterval(interval);
    }, [scheduledAt]);
  
    return (
      <div>
        {formattedDate ? <div className="font-medium">{formattedDate}</div> : <div className="font-medium">{format(new Date(), 'MMM d, yyyy, p')}</div>}
        {relativeTime && <div className="text-xs text-muted-foreground">{relativeTime}</div>}
      </div>
    );
};

export const columns: ColumnDef<Reminder>[] = [
  {
    accessorKey: 'contact',
    header: 'Contact',
    cell: ({ row }) => {
      const contact = row.original.contact;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{contact.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'message',
    header: 'Message',
    cell: ({ row }) => (
      <div className="max-w-xs truncate text-muted-foreground">
        {row.original.message}
      </div>
    ),
  },
  {
    accessorKey: 'channel',
    header: 'Channel',
    cell: ({ row }) => {
      const Icon = channelIcons[row.original.channel];
      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.channel}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'scheduledAt',
    header: 'Schedule',
    cell: ({ row }) => {
        const scheduledAt = row.original.scheduledAt;
        return <ScheduledAtCell scheduledAt={scheduledAt} />;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={status === 'sent' ? 'secondary' : status === 'pending' ? 'outline' : status === 'paid' ? 'default' : 'destructive'}
          className={cn(
            status === 'sent' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300',
            status === 'pending' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300',
            status === 'paid' && 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300',
          )}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const reminder = row.original;
      const { toast } = useToast();
      const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);


      function handleMarkAsPaid() {
        console.log('Marking reminder as paid:', reminder.id);
        // Here you would typically update the state or call an API
        // For now, we'll just show a toast
        toast({
          title: 'Payment Recorded',
          description: `Reminder for ${reminder.contact.name} marked as paid.`,
        });
      }

      return (
        <div className='flex items-center justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <ViewReminderDialog reminder={reminder}>
                   <button className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
                    <Eye className="mr-2 h-4 w-4"/>
                    <span>View details</span>
                   </button>
                </ViewReminderDialog>
              </DropdownMenuItem>
              {(reminder.status === 'pending' || reminder.status === 'sent') && (
                <DropdownMenuItem onClick={handleMarkAsPaid}>
                  <CheckCircle className="mr-2 h-4 w-4"/>
                  <span>Mark as paid</span>
                </DropdownMenuItem>
              )}
              {reminder.status === 'pending' && (
                 <ScheduleReminderDialog reminder={reminder} mode='edit' open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit reminder</span>
                    </DropdownMenuItem>
                 </ScheduleReminderDialog>
              )}
              <DropdownMenuSeparator />
              {reminder.status === 'pending' && (
                <DropdownMenuItem asChild>
                  <CancelReminderDialog reminderId={reminder.id}>
                      <button className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-destructive/10 focus:text-destructive data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Cancel reminder</span>
                      </button>
                  </CancelReminderDialog>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
