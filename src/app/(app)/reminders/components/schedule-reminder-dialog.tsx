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
import { CalendarIcon, Mail, MessageSquare, Phone } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockContacts } from '@/lib/mock-data';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useSubscription } from '@/hooks/use-subscription';
import Link from 'next/link';

const formSchema = z.object({
  contactId: z.string({ required_error: 'Please select a contact.' }),
  channel: z.enum(['Email', 'SMS', 'WhatsApp'], { required_error: 'Please select a channel.'}),
  scheduledAt: z.date({ required_error: 'A date and time is required.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export function ScheduleReminderDialog({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const { isPro } = useSubscription();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: 'Hi, just following up on our last conversation. Let me know if you have any questions!',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isPro) {
      toast({
        variant: 'destructive',
        title: 'Upgrade Required',
        description: 'Please upgrade to a Pro plan to schedule reminders.',
        action: <Button asChild><Link href="/pricing">Upgrade</Link></Button>,
      });
      return;
    }
    console.log(values);
    toast({
      title: 'Reminder Scheduled',
      description: `A reminder has been set for ${format(values.scheduledAt, 'PPP p')}.`,
    });
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className='font-headline'>Schedule a Follow-Up</DialogTitle>
          <DialogDescription>
            Set up an automated reminder for your contact.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="contactId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a contact" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockContacts.map(contact => (
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
                <FormItem className="space-y-3">
                  <FormLabel>Channel</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 gap-4"
                    >
                      <FormItem>
                        <RadioGroupItem value="Email" id="r-email" className="peer sr-only" />
                        <FormLabel htmlFor="r-email" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                          <Mail className="mb-3 h-6 w-6" />
                          Email
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <RadioGroupItem value="SMS" id="r-sms" className="peer sr-only" />
                        <FormLabel htmlFor="r-sms" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                          <MessageSquare className="mb-3 h-6 w-6" />
                          SMS
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <RadioGroupItem value="WhatsApp" id="r-whatsapp" className="peer sr-only" />
                        <FormLabel htmlFor="r-whatsapp" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                          <Phone className="mb-3 h-6 w-6" />
                          WhatsApp
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
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
                        disabled={(date) => date < new Date()}
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
              <Button type="submit" className="w-full">Schedule Reminder</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
