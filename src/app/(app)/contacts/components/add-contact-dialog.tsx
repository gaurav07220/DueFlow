
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
import type { Contact } from '@/lib/types';
import { useFirebase, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useUser } from '@/firebase/provider';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
});

export function AddContactDialog({ 
  children,
  contact,
  mode = 'add'
}: { 
  children: React.ReactNode,
  contact?: Contact,
  mode?: 'add' | 'edit' 
}) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { firestore } = useFirebase();
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mode === 'edit' && contact ? {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    } : {
      name: '',
      email: '',
      phone: '',
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset(mode === 'edit' && contact ? {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
      } : {
        name: '',
        email: '',
        phone: '',
      });
    }
  }, [open, form, mode, contact]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !user) return;
    
    setIsSubmitting(true);
    
    const newContactData = {
      ...values,
      userId: user.uid,
      createdAt: new Date(),
      lastContacted: new Date(),
      status: 'active',
      avatarUrl: `https://i.pravatar.cc/150?u=${Math.random()}`
    };

    if (mode === 'add') {
      const contactsColRef = collection(firestore, 'users', user.uid, 'contacts');
      addDocumentNonBlocking(contactsColRef, newContactData)
        .then(() => {
          toast({
            title: 'Contact Added',
            description: `${values.name} has been successfully added.`,
          });
          form.reset();
          setOpen(false);
        })
        .catch(err => {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: `There was an error adding the contact: ${err.message}`,
          });
        })
        .finally(() => setIsSubmitting(false));
    } else if (contact) {
      const contactDocRef = doc(firestore, 'users', user.uid, 'contacts', contact.id);
      updateDocumentNonBlocking(contactDocRef, values)
        .then(() => {
          toast({
            title: 'Contact Updated',
            description: `${values.name} has been successfully updated.`,
          });
          setOpen(false);
        })
        .catch(err => {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: `There was an error updating the contact: ${err.message}`,
          });
        })
        .finally(() => setIsSubmitting(false));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className='font-headline'>{mode === 'add' ? 'Add New Contact' : 'Edit Contact'}</DialogTitle>          
          <DialogDescription>
            {mode === 'add' ? 'Enter the details of your new contact below.' : 'Update the contact details.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1-555-0101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" loading={isSubmitting}>{mode === 'add' ? 'Save Contact' : 'Save Changes'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
