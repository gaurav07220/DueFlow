
'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getInitials } from '@/lib/utils';
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import type { User as UserEntity } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';


const profileSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  businessName: z.string().optional(),
  phoneNumber: z.string().optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Please enter your current password." }),
    newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match.",
    path: ["confirmPassword"],
});


export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const userDocRef = useMemoFirebase(() => 
    user ? doc(firestore, 'users', user.uid) : null
  , [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserEntity>(userDocRef);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
        displayName: '',
        businessName: '',
        phoneNumber: '',
    }
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
      resolver: zodResolver(passwordSchema),
      defaultValues: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
      }
  });

  useEffect(() => {
    if (userProfile) {
        profileForm.reset({
            displayName: userProfile.displayName || user?.displayName || '',
            businessName: userProfile.businessName || '',
            phoneNumber: userProfile.phoneNumber || user?.phoneNumber || '',
        });
    } else if (user) {
        profileForm.reset({
            displayName: user.displayName || '',
            phoneNumber: user.phoneNumber || '',
        })
    }
  }, [userProfile, user, profileForm]);
  
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

  const handleChangePassword = async (values: z.infer<typeof passwordSchema>) => {
      if (!user || !user.email) return;

      setIsChangingPassword(true);
      try {
        const credential = EmailAuthProvider.credential(user.email, values.currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, values.newPassword);
        
        toast({
            title: 'Password Changed',
            description: 'Your password has been successfully changed.',
        });
        passwordForm.reset();

      } catch (error: any) {
          toast({
              variant: 'destructive',
              title: 'Password Change Failed',
              description: error.code === 'auth/wrong-password' 
                ? 'The current password you entered is incorrect.' 
                : error.message,
          });
      } finally {
          setIsChangingPassword(false);
      }
  }
  
  const handleDeleteAccount = async () => {
    if (!user || !firestore) return;
    setIsDeleting(true);

    try {
        // Delete user's Firestore data first
        const userRef = doc(firestore, 'users', user.uid);
        await deleteDoc(userRef);

        // Delete user from Auth
        await deleteUser(user);
        
        toast({
            title: 'Account Deleted',
            description: 'Your account has been permanently deleted.',
        });
        
        router.push('/login');

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error Deleting Account',
            description: 'Please log out and log back in before trying to delete your account. ' + error.message,
        });
    } finally {
        setIsDeleting(false);
    }
  };


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
        <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)}>
        <CardHeader>
          <CardTitle className='font-headline'>Profile Details</CardTitle>
          <CardDescription>
            This information will be used for your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback>{getInitials(user.displayName || user.email || '')}</AvatarFallback>
            </Avatar>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input id="displayName" {...profileForm.register('displayName')} />
               {profileForm.formState.errors.displayName && <p className='text-sm text-destructive'>{profileForm.formState.errors.displayName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input id="business-name" {...profileForm.register('businessName')} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
              <Input id="phone" type="tel" {...profileForm.register('phoneNumber')} />
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
        <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handleChangePassword)}>
                <CardHeader>
                <CardTitle className='font-headline'>Change Password</CardTitle>
                <CardDescription>
                    For security, please choose a strong password.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter className='border-t pt-6'>
                <Button type="submit" loading={isChangingPassword}>Change Password</Button>
                </CardFooter>
            </form>
        </Form>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
            <div className='flex items-center gap-2'>
                 <AlertTriangle className='text-destructive'/>
                 <CardTitle className='font-headline text-destructive'>Danger Zone</CardTitle>
            </div>
            <CardDescription>
                These actions are permanent and cannot be undone.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className='text-sm text-muted-foreground'>
                Deleting your account will permanently remove all your data, including contacts, reminders, and settings. This action is irreversible.
            </p>
        </CardContent>
        <CardFooter className='border-t border-destructive/50 pt-6'>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete My Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove all your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild onClick={handleDeleteAccount}>
                        <Button variant='destructive' loading={isDeleting}>Yes, Delete My Account</Button>
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}

    