
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Reminder } from '@/lib/types';
import { subscriptionPlans } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { CreditCard } from 'lucide-react';


const billingHistory = [
    { invoice: 'INV-2023-001', date: 'January 1, 2023', amount: '₹999.00', status: 'Paid' },
    { invoice: 'INV-2022-012', date: 'December 1, 2022', amount: '₹999.00', status: 'Paid' },
    { invoice: 'INV-2022-011', date: 'November 1, 2022', amount: '₹999.00', status: 'Paid' },
]

export default function SettingsPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const remindersQuery = useMemoFirebase(() =>
        user ? query(collection(firestore, 'reminders'), where('userId', '==', user.uid)) : null,
        [firestore, user]
    );
    const { data: reminders, isLoading: isLoadingReminders } = useCollection<Reminder>(remindersQuery);
    
    // This is a mock subscription status. In a real app, this would come from your user's profile.
    const subscriptionStatus = 'Growth'; 
    const currentPlan = subscriptionPlans.find(p => p.name === subscriptionStatus);
    const remindersUsed = reminders?.length || 0;
    const reminderQuota = currentPlan?.name === 'Growth' ? 500 : currentPlan?.name === 'Scale' ? Infinity : 10;
    const usagePercentage = reminderQuota === Infinity ? 0 : (remindersUsed / reminderQuota) * 100;
    
    const isLoading = isUserLoading || isLoadingReminders;

    function handleSaveChanges() {
        toast({
            title: 'Settings Saved',
            description: 'Your changes have been successfully saved (simulation).',
        })
    }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
        <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold tracking-tight">
            Settings
            </h1>
            <p className="text-muted-foreground">
            Manage your application preferences and integrations.
            </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Preferences Card */}
            <Card>
                <CardHeader>
                    <CardTitle className='font-headline'>Preferences</CardTitle>
                    <CardDescription>Customize the application's appearance and behavior.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                            <span>Dark Mode</span>
                            <span className="font-normal text-sm text-muted-foreground">
                            Enable or disable the dark theme.
                            </span>
                        </Label>
                        <Switch id="dark-mode" defaultChecked={true} />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select defaultValue="ist">
                            <SelectTrigger id="timezone" className="max-w-sm">
                                <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                                <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                                <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                                <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                                <SelectItem value="ist">Indian Standard Time (IST)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <Separator />
                     <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en-us">
                            <SelectTrigger id="language" className="max-w-sm">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en-us">English (United States)</SelectItem>
                                <SelectItem value="en-uk">English (United Kingdom)</SelectItem>
                                <SelectItem value="es-es">Español (España)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications Card */}
            <Card>
                <CardHeader>
                    <CardTitle className='font-headline'>Notifications</CardTitle>
                    <CardDescription>Choose how you want to be notified.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                            <span>Email Notifications</span>
                            <span className="font-normal text-sm text-muted-foreground">
                            Receive an email when a reminder is sent or fails.
                            </span>
                        </Label>
                        <Switch id="email-notifications" defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                            <span>Push Notifications</span>
                            <span className="font-normal text-sm text-muted-foreground">
                             Get push notifications on your devices (coming soon).
                            </span>
                        </Label>
                        <Switch id="push-notifications" disabled />
                    </div>
                </CardContent>
            </Card>

            {/* Subscription Card */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className='font-headline'>Subscription & Billing</CardTitle>
                    <CardDescription>Manage your plan, payment method, and view billing history.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    { isLoading ? <Skeleton className='h-24 w-full' /> :
                        currentPlan ? (
                            <>
                                <div className="rounded-lg border bg-secondary/50 p-4 space-y-4">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p>You are on the <span className='font-bold text-primary'>{currentPlan.name}</span> plan.</p>
                                        <Button asChild>
                                            <Link href="/pricing">Upgrade Plan</Link>
                                        </Button>
                                    </div>
                                    {reminderQuota !== Infinity && (
                                        <div>
                                            <div className="flex justify-between items-center mb-1 text-sm">
                                                <span className='text-muted-foreground'>Reminder Usage</span>
                                                <span>{remindersUsed} / {reminderQuota}</span>
                                            </div>
                                            <Progress value={usagePercentage} className="h-2" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h4 className='font-medium mb-2'>Payment Method</h4>
                                    <div className='flex items-center justify-between rounded-lg border p-4'>
                                        <div className='flex items-center gap-3'>
                                            <CreditCard className='h-6 w-6 text-muted-foreground'/>
                                            <div>
                                                <p className='font-medium'>Visa ending in 1234</p>
                                                <p className='text-sm text-muted-foreground'>Expires 12/2025</p>
                                            </div>
                                        </div>
                                        <Button variant='outline'>Update</Button>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className='font-medium mb-2'>Billing History</h4>
                                    <div className="rounded-lg border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                <TableHead>Invoice</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {billingHistory.map((item) => (
                                                <TableRow key={item.invoice}>
                                                    <TableCell className="font-medium">{item.invoice}</TableCell>
                                                    <TableCell>{item.date}</TableCell>
                                                    <TableCell>{item.amount}</TableCell>
                                                    <TableCell>{item.status}</TableCell>
                                                </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </>
                        ) : (
                             <p className='text-muted-foreground'>Could not load subscription details.</p>
                        )
                    }
                </CardContent>
            </Card>
        </div>
        
        <div className='flex justify-start pt-4 border-t'>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
        </div>
    </div>
  );
}
