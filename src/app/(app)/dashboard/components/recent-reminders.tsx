'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Reminder } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';

const useRelativeTime = (date: Date) => {
  const [relativeTime, setRelativeTime] = useState('');

  useEffect(() => {
    setRelativeTime(formatDistanceToNow(date, { addSuffix: true }));
  }, [date]);

  return relativeTime;
};

const ReminderItem = ({ reminder }: { reminder: Reminder }) => {
  const relativeTime = useRelativeTime(reminder.scheduledAt);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar className="h-9 w-9">
        <AvatarImage src={reminder.contact.avatarUrl} alt="Avatar" />
        <AvatarFallback>{reminder.contact.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-none truncate">
          {reminder.contact.name}
        </p>
        <p className="text-sm text-muted-foreground truncate">{reminder.message}</p>
      </div>
      <div className="ml-auto font-medium text-right shrink-0">
        <Badge
          variant={reminder.channel === 'Email' ? 'default' : reminder.channel === 'SMS' ? 'secondary' : 'outline'}
          className={cn(reminder.channel === 'Email' && 'bg-blue-500 hover:bg-blue-600', reminder.channel === 'SMS' && 'bg-green-500 hover:bg-green-600', reminder.channel === 'WhatsApp' && 'bg-teal-500 hover:bg-teal-600', 'text-white')}
        >
          {reminder.channel}
        </Badge>
        <p className="text-xs text-muted-foreground mt-1">
          {relativeTime}
        </p>
      </div>
    </div>
  );
};


type RecentRemindersProps = {
  reminders: Reminder[];
};

export function RecentReminders({ reminders }: RecentRemindersProps) {
  return (
    <div className="space-y-4">
      {reminders.map((reminder) => (
        <ReminderItem key={reminder.id} reminder={reminder} />
      ))}
    </div>
  );
}
