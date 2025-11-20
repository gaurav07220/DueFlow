
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ReminderWithContact } from '@/lib/types';
import { cn, getInitials } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Eye, Mail, MessageSquare, MoreHorizontal, Phone, CheckCheck, Send, AlertTriangle, CornerDownLeft, CircleDollarSign, Info, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const channelIcons = {
  Email: Mail,
  SMS: MessageSquare,
  WhatsApp: Phone,
  System: Info,
};

const statusConfig: Record<string, { icon: React.ElementType, color: string, bgColor: string, label: string }> = {
    sent: { icon: Send, color: 'text-blue-500', bgColor: 'bg-blue-100', label: 'Sent' },
    delivered: { icon: CheckCheck, color: 'text-gray-500', bgColor: 'bg-gray-100', label: 'Delivered' },
    seen: { icon: Eye, color: 'text-purple-500', bgColor: 'bg-purple-100', label: 'Seen' },
    replied: { icon: CornerDownLeft, color: 'text-indigo-500', bgColor: 'bg-indigo-100', label: 'Replied' },
    ignored: { icon: AlertTriangle, color: 'text-orange-500', bgColor: 'bg-orange-100', label: 'Ignored' },
    failed: { icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-100', label: 'Failed' },
    paid: { icon: CircleDollarSign, color: 'text-green-500', bgColor: 'bg-green-100', label: 'Paid' },
};


export const columns: ColumnDef<ReminderWithContact>[] = [
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
          <div className="flex flex-col">
            <span className="font-medium">{contact.name}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'channel',
    header: 'Channel',
    cell: ({ row }) => {
      const Icon = channelIcons[row.original.channel];
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          {Icon && <Icon className="h-4 w-4" />}
          <span>{row.original.channel}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'scheduledAt',
    header: 'Date',
    cell: ({ row }) => {
        const date = new Date(row.original.scheduledAt);
        return (
            <div className="text-muted-foreground">
                {format(date, 'MMM d, yyyy, p')}
            </div>
        )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const config = statusConfig[status];
      if (!config) return <Badge>{status}</Badge>;
      return (
        <Badge
          variant="outline"
          className={cn('border-0 font-normal', config.bgColor, config.color, 'dark:' + config.bgColor + '/50 dark:' + config.color)}
        >
          <config.icon className="mr-1 h-3 w-3" />
          {config.label}
        </Badge>
      );
    },
  },
   {
    accessorKey: 'message',
    header: 'Details',
    cell: ({ row }) => (
        <p className="text-muted-foreground max-w-xs truncate">{row.original.message}</p>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.original.message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];
