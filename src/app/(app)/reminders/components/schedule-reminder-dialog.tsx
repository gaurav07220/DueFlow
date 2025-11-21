
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
import { CalendarIcon, IndianRupee } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Contact, ReminderWithContact } from '@/lib/types';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, addDoc, doc, updateDoc, where } from 'firebase/firestore';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  contactId: z.string({ required_error: 'Please select a contact.' }),
  channel: z.enum(['Email', 'SMS', 'WhatsApp'], { required_error: 'Please select a channel.'}),
  scheduledAt: z.date({ required_error: 'A date and time is required.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  amount: z.coerce.number().optional(),
});

type ScheduleReminderDialogProps = { 
  children: React.ReactNode;
  reminder?: ReminderWithContact;
  mode?: 'add' | 'edit';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ScheduleReminderDialog({ children, reminder, mode = 'add', open: controlledOpen, onOpenChange: setControlledOpen }: ScheduleReminderDialogProps) {
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { user } = useUser();
  const firestore = useFirestore();

  const contactsQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'contacts'), where('userId', '==', user.uid)) : null,
    [firestore, user]
  );
  const { data: contacts, isLoading: isLoadingContacts } = useCollection<Contact>(contactsQuery);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mode === 'edit' && reminder ? {
      contactId: reminder.contactId,
      channel: reminder.channel,
      scheduledAt: new Date(reminder.scheduledAt),
      message: reminder.message,
      amount: reminder.amount || 0,
    } : {
      message: 'Hi, just following up on our last conversation. Let me know if you have any questions!',
      amount: 0,
    },
  });

  React.useEffect(() => {
    if (open) {
        if (mode === 'edit' && reminder) {
        form.reset({
            contactId: reminder.contactId,
            channel: reminder.channel,
            scheduledAt: new Date(reminder.scheduledAt),
            message: reminder.message,
            amount: reminder.amount || 0,
        });
        } else {
        form.reset({
            contactId: undefined,
            channel: undefined,
            scheduledAt: undefined,
            message: 'Hi, just following up on our last conversation. Let me know if you have any questions!',
            amount: 0,
        });
        }
    }
  }, [reminder, mode, form, open]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if(!user || !firestore) return;
    setIsSubmitting(true);
    
    try {
      if (mode === 'add') {
        const newReminder = {
          userId: user.uid,
          contactId: values.contactId,
          channel: values.channel,
          scheduledAt: values.scheduledAt.toISOString(),
          message: values.message,
          amount: values.amount || 0,
          status: 'pending' as const,
        };
        await addDoc(collection(firestore, 'reminders'), newReminder);
        toast({
          title: 'Reminder Scheduled',
          description: `A reminder has been set for ${format(values.scheduledAt, 'PPP p')}.`,
        });
      } else if (mode === 'edit' && reminder) {
        const reminderRef = doc(firestore, 'reminders', reminder.id);
        await updateDoc(reminderRef, {
            ...values,
            scheduledAt: values.scheduledAt.toISOString(),
            amount: values.amount || 0,
        });
        toast({
          title: 'Reminder Updated',
          description: `The reminder has been successfully updated.`,
        });
      }
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Error Saving Reminder',
        description: error.message || 'There was a problem saving your reminder.',
      });
    }

    form.reset();
    setOpen(false);
    setIsSubmitting(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md w-[90vw] rounded-lg">
        <DialogHeader>
          <DialogTitle className='font-headline'>{mode === 'add' ? 'Schedule a Follow-Up' : 'Edit Reminder'}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Set up an automated reminder for your contact.' : 'Update the details of your scheduled reminder.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className='h-[60vh] p-1'>
            <div className='space-y-4 pr-4'>
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
                      </SelectTrigger>
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
                          defaultValue={field.value ? format(field.value, 'HH:mm') : format(new Date(), 'HH:mm')}
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

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (Optional)</FormLabel>
                  <div className="relative">
                     <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} className="pl-8" onChange={e => field.onChange(e.target.valueAsNumber)} value={field.value ?? 0} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            </ScrollArea>
            <DialogFooter className='pt-4 border-t'>
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
