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
import type { Contact } from '@/lib/types';
import { cn, getInitials } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { format, formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';
import React from 'react';
import { AddContactDialog } from './add-contact-dialog';
import { DeleteContactDialog } from './delete-contact-dialog';

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{contact.name}</span>
            <span className="text-xs text-muted-foreground">{contact.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => <div className="text-muted-foreground">{row.original.phone}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={status === 'active' ? 'secondary' : 'outline'}
          className={cn(
            status === 'active' &&
              'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300'
          )}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'lastContacted',
    header: 'Last Contacted',
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {formatDistanceToNow(row.original.lastContacted, { addSuffix: true })}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {format(row.original.createdAt, 'MMM d, yyyy')}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const contact = row.original;
      const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
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
            <AddContactDialog contact={contact} mode='edit' open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit contact</span>
              </DropdownMenuItem>
            </AddContactDialog>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <DeleteContactDialog contactId={contact.id}>
                <button className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-destructive/10 focus:text-destructive data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
                  <Trash  className="mr-2 h-4 w-4" />
                  <span>Delete contact</span>
                </button>
              </DeleteContactDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
