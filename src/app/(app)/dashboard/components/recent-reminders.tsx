
'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Reminder } from '@/lib/types';
import { cn, getInitials } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';

const useRelativeTime = (date: Date | string) => {
  const [relativeTime, setRelativeTime] = useState('');
  const actualDate = new Date(date);

  useEffect(() => {
    setRelativeTime(formatDistanceToNow(actualDate, { addSuffix: true }));

    const interval = setInterval(() => {
      setRelativeTime(formatDistanceToNow(actualDate, { addSuffix: true }));
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, [actualDate]);

  return relativeTime;
};


const ReminderItem = ({ reminder }: { reminder: Reminder }) => {
  const relativeTime = useRelativeTime(reminder.scheduledAt);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar className="h-9 w-9">
        <AvatarFallback>{getInitials(reminder.contact.name)}</AvatarFallback>
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
          className={cn(reminder.channel === 'Email' && 'bg-green-500/10 text-green-400 border-green-400/50', reminder.channel === 'SMS' && 'bg-green-500/10 text-green-400 border-green-400/50', reminder.channel === 'WhatsApp' && 'bg-green-500/10 text-green-400 border-green-400/50', 'text-white')}
        >
          {reminder.channel}
        </Badge>
        {relativeTime && <p className="text-xs text-muted-foreground mt-1">
          {relativeTime}
        </p>}
      </div>
    </div>
  );
};


type RecentRemindersProps = {
  reminders: Reminder[];
};

export function RecentReminders({ reminders }: RecentRemindersProps) {
  if (!reminders.length) {
    return <p className="text-sm text-muted-foreground text-center">No upcoming reminders.</p>
  }
  return (
    <div className="space-y-4">
      {reminders.map((reminder) => (
        <ReminderItem key={reminder.id} reminder={reminder} />
      ))}
    </div>
  );
}

    