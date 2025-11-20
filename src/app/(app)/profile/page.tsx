
'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getInitials } from '@/lib/utils';
import { useAuth, useFirebase, useUser, updateDocumentNonBlocking } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useForm, zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  businessName: z.string().optional(),
});


export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    values: {
        name: user?.displayName || '',
        businessName: '', // This would come from the user's firestore doc
    }
  });
  
  const handleUpdateProfile = async (values: z.infer<typeof profileSchema>) => {
    if (!user || !auth.currentUser) return;
    
    setIsUpdating(true);
    
    try {
        await updateProfile(auth.currentUser, { displayName: values.name });
        
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDocumentNonBlocking(userDocRef, { displayName: values.name });
        
        toast({
            title: 'Profile Updated',
            description: 'Your profile has been successfully updated.',
        });

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message,
        });
    } finally {
        setIsUpdating(false);
    }
  }


  if (isUserLoading) {
    return <div>Loading profile...</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }


  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
       <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your personal and business information.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className='font-headline'>Profile Details</CardTitle>
          <CardDescription>
            This information will be used for your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(handleUpdateProfile)}>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback>{getInitials(user.displayName || '')}</AvatarFallback>
            </Avatar>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...form.register('name')} />
               {form.formState.errors.name && <p className='text-sm text-destructive'>{form.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input id="business-name" {...form.register('businessName')} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
              <Input id="phone" type="tel" defaultValue={user.phoneNumber || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email || ''} disabled />
            </div>
          </div>
        </CardContent>
         <CardFooter className='border-t pt-6'>
          <Button type='submit' loading={isUpdating}>Update Profile</Button>
        </CardFooter>
        </form>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className='font-headline'>Change Password</CardTitle>
          <CardDescription>
            For security, please choose a strong password. (Functionality not implemented)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" disabled />
          </div>
           <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" disabled />
          </div>
        </CardContent>
        <CardFooter className='border-t pt-6'>
          <Button disabled>Change Password</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
