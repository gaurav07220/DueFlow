
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
import { useFirestore, useUser } from '@/firebase';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';

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
  const { user } = useUser();
  const firestore = useFirestore();

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'User or database not available. Please try again.',
        });
        return;
    }
    
    setIsSubmitting(true);
    
    try {
        if (mode === 'add') {
            const contactsCollection = collection(firestore, 'contacts');
            await addDoc(contactsCollection, {
                ...values,
                userId: user.uid,
                createdAt: new Date().toISOString(),
                lastContacted: new Date().toISOString(),
                status: 'active',
                avatarUrl: `https://i.pravatar.cc/150?u=${values.name}`,
            });
            toast({
                title: 'Contact Added',
                description: `${values.name} has been successfully added.`,
            });
        } else if (mode === 'edit' && contact) {
            const contactRef = doc(firestore, 'contacts', contact.id);
            await updateDoc(contactRef, values);
            toast({
                title: 'Contact Updated',
                description: `${values.name}'s information has been successfully updated.`,
            });
        }
    } catch (error: any) {
        const title = mode === 'add' ? 'Error Adding Contact' : 'Error Updating Contact';
        toast({
            variant: 'destructive',
            title,
            description: error.message || `There was a problem saving the contact.`,
        });
    }
    
    form.reset();
    setOpen(false);
    setIsSubmitting(false);
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
