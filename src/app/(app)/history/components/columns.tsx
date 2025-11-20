'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { HistoryLog } from '@/lib/types';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Eye, Mail, MessageSquare, MoreHorizontal, Phone, CheckCheck, Send, AlertTriangle, CornerDownLeft } from 'lucide-react';

const channelIcons = {
  Email: Mail,
  SMS: MessageSquare,
  WhatsApp: Phone,
};

const statusConfig = {
    delivered: { icon: Send, color: 'text-gray-500', bgColor: 'bg-gray-100', label: 'Delivered' },
    seen: { icon: Eye, color: 'text-blue-500', bgColor: 'bg-blue-100', label: 'Seen' },
    replied: { icon: CheckCheck, color: 'text-green-500', bgColor: 'bg-green-100', label: 'Replied' },
    ignored: { icon: CornerDownLeft, color: 'text-orange-500', bgColor: 'bg-orange-100', label: 'Ignored' },
    failed: { icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-100', label: 'Failed' },
};


export const columns: ColumnDef<HistoryLog>[] = [
  {
    accessorKey: 'contactName',
    header: 'Contact',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.contactName}</div>
    ),
  },
  {
    accessorKey: 'channel',
    header: 'Channel',
    cell: ({ row }) => {
      const Icon = channelIcons[row.original.channel];
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-4 w-4" />
          <span>{row.original.channel}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'sentAt',
    header: 'Sent At',
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {format(row.original.sentAt, 'MMM d, yyyy, p')}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const config = statusConfig[status];
      return (
        <Badge
          variant="outline"
          className={cn('border-0 font-normal', config.bgColor, config.color)}
        >
          <config.icon className="mr-1 h-3 w-3" />
          {config.label}
        </Badge>
      );
    },
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
              <p>{row.original.details}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];
