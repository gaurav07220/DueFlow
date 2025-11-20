'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { format, formatDistanceToNow } from 'date-fns';
import { Mail, MessageSquare, MoreHorizontal, Phone } from 'lucide-react';
import React from 'react';

const channelIcons = {
  Email: Mail,
  SMS: MessageSquare,
  WhatsApp: Phone,
};

const ScheduledAtCell = ({ scheduledAt }: { scheduledAt: Date }) => {
    const [relativeTime, setRelativeTime] = React.useState('');
    const isPast = new Date() > scheduledAt;
  
    React.useEffect(() => {
      setRelativeTime(formatDistanceToNow(scheduledAt, { addSuffix: true }));
    }, [scheduledAt]);
  
    return (
      <div>
        <div className="font-medium">{format(scheduledAt, 'MMM d, yyyy, p')}</div>
        {relativeTime && <div className="text-xs text-muted-foreground">{relativeTime}{isPast ? "" : ""}</div>}
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
            <AvatarImage src={contact.avatarUrl} alt={contact.name} />
            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
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
          variant={status === 'sent' ? 'secondary' : status === 'pending' ? 'outline' : 'destructive'}
          className={cn(
            status === 'sent' && 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300',
            status === 'pending' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300',
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
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit reminder</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">Cancel reminder</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
