
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Reminder } from '@/lib/types';
import { mockContacts } from '@/lib/mock-data';

const formSchema = z.object({
  contactId: z.string({ required_error: 'Please select a contact.' }),
  channel: z.enum(['Email', 'SMS', 'WhatsApp'], { required_error: 'Please select a channel.'}),
  scheduledAt: z.date({ required_error: 'A date and time is required.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ScheduleReminderDialogProps = { 
  children: React.ReactNode;
  reminder?: Reminder;
  mode?: 'add' | 'edit';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ScheduleReminderDialog({ children, reminder, mode = 'add', open, onOpenChange }: ScheduleReminderDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const contacts = mockContacts;
  const isLoadingContacts = false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mode === 'edit' && reminder ? {
      contactId: reminder.contact.id,
      channel: reminder.channel,
      scheduledAt: new Date(reminder.scheduledAt),
      message: reminder.message,
    } : {
      message: 'Hi, just following up on our last conversation. Let me know if you have any questions!',
    },
  });

  React.useEffect(() => {
    if (mode === 'edit' && reminder) {
      form.reset({
        contactId: reminder.contact.id,
        channel: reminder.channel,
        scheduledAt: new Date(reminder.scheduledAt),
        message: reminder.message,
      });
    } else {
      form.reset({
        message: 'Hi, just following up on our last conversation. Let me know if you have any questions!',
      });
    }
  }, [reminder, mode, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    setTimeout(() => {
      if (mode === 'add') {
        toast({
          title: 'Reminder Scheduled',
          description: `A reminder has been set for ${format(values.scheduledAt, 'PPP p')} (mock).`,
        });
      } else {
        toast({
          title: 'Reminder Updated',
          description: `The reminder has been updated (mock).`,
        });
      }
      form.reset();
      onOpenChange?.(false);
      setIsSubmitting(false);
    }, 1000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md w-[90vw] rounded-lg">
        <DialogHeader>
          <DialogTitle className='font-headline'>{mode === 'add' ? 'Schedule a Follow-Up' : 'Edit Reminder'}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Set up an automated reminder for your contact.' : 'Update the details of your scheduled reminder.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 pr-2 max-h-[70vh] overflow-y-auto [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
            
            <FormField
              control={form.control}
              name="contactId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingContacts}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingContacts ? "Loading contacts..." : "Select a contact"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contacts?.map(contact => (
                        <SelectItem key={contact.id} value={contact.id}>{contact.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="channel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a channel" />
                      </Trigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduledAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date and Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP p')
                          ) : (
                            <span>Pick a date and time</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date() && mode === 'add'}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <Input
                          type="time"
                          defaultValue={format(field.value || new Date(), 'HH:mm')}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':');
                            const newDate = new Date(field.value || new Date());
                            newDate.setHours(Number(hours), Number(minutes));
                            field.onChange(newDate);
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your follow-up message..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="w-full" loading={isSubmitting}>
                {mode === 'add' ? 'Schedule Reminder' : 'Save Changes'}
              </Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    