
'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getInitials } from '@/lib/utils';
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, setDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import type { User as UserEntity } from '@/lib/types';

const profileSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  businessName: z.string().optional(),
  phoneNumber: z.string().optional(),
});


export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const userDocRef = useMemoFirebase(() => 
    user ? doc(firestore, 'users', user.uid) : null
  , [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserEntity>(userDocRef);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
        displayName: '',
        businessName: '',
        phoneNumber: '',
    }
  });

  useEffect(() => {
    if (userProfile) {
        form.reset({
            displayName: userProfile.displayName || user?.displayName || '',
            businessName: userProfile.businessName || '',
            phoneNumber: userProfile.phoneNumber || user?.phoneNumber || '',
        });
    } else if (user) {
        form.reset({
            displayName: user.displayName || '',
            phoneNumber: user.phoneNumber || '',
        })
    }
  }, [userProfile, user, form]);
  
  const handleUpdateProfile = async (values: z.infer<typeof profileSchema>) => {
    if (!user || !auth.currentUser || !firestore) return;
    
    setIsUpdating(true);
    
    try {
        // Update auth profile
        if (auth.currentUser.displayName !== values.displayName) {
            await updateProfile(auth.currentUser, { displayName: values.displayName });
        }
        
        // Update firestore document
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, {
            ...userProfile, // preserve existing data
            displayName: values.displayName,
            businessName: values.businessName,
            phoneNumber: values.phoneNumber,
            email: user.email, // ensure email is always present
        }, { merge: true });
        
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

  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
    return (
        <div className="space-y-8 animate-in fade-in-0 duration-500">
            <div className="space-y-2">
                <Skeleton className='h-9 w-48' />
                <Skeleton className='h-5 w-72' />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className='font-headline'>Profile Details</CardTitle>
                    <CardDescription>This information will be used for your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <Skeleton className='h-20 w-20 rounded-full' />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2"><Skeleton className='h-5 w-20' /><Skeleton className='h-10 w-full' /></div>
                        <div className="space-y-2"><Skeleton className='h-5 w-28' /><Skeleton className='h-10 w-full' /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2"><Skeleton className='h-5 w-24' /><Skeleton className='h-10 w-full' /></div>
                        <div className="space-y-2"><Skeleton className='h-5 w-16' /><Skeleton className='h-10 w-full' /></div>
                    </div>
                </CardContent>
                <CardFooter className='border-t pt-6'>
                    <Skeleton className='h-10 w-32' />
                </CardFooter>
            </Card>
        </div>
    );
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
              <AvatarFallback>{getInitials(user.displayName || user.email || '')}</AvatarFallback>
            </Avatar>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input id="displayName" {...form.register('displayName')} />
               {form.formState.errors.displayName && <p className='text-sm text-destructive'>{form.formState.errors.displayName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input id="business-name" {...form.register('businessName')} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
              <Input id="phone" type="tel" {...form.register('phoneNumber')} />
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
