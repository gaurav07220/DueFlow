

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
    const { toast } = useToast();

    function handleSaveChanges() {
        toast({
            title: 'Settings Saved',
            description: 'Your changes have been successfully saved.',
        })
    }

  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in-0 duration-500">
        <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold tracking-tight">
            Settings
            </h1>
            <p className="text-muted-foreground">
            Manage your application preferences and integrations.
            </p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className='font-headline'>API Integrations</CardTitle>
                <CardDescription>Connect DueFlow to your other services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className='space-y-2'>
                    <Label htmlFor="whatsapp-api">WhatsApp API Key</Label>
                    <Input id="whatsapp-api" placeholder="Enter your WhatsApp Business API key" />
                    <p className='text-xs text-muted-foreground'>Required for sending WhatsApp reminders.</p>
                </div>
                 <div className='space-y-2'>
                    <Label htmlFor="smtp-email">Email SMTP Settings</Label>
                    <Input id="smtp-email" placeholder="smtp.example.com:587" />
                    <p className='text-xs text-muted-foreground'>Configure your SMTP server for sending emails.</p>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className='font-headline'>Preferences</CardTitle>
                <CardDescription>Customize the application's behavior.</CardDescription>
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
                    <Select defaultValue="est">
                        <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pst">Pacific Standard Time</SelectItem>
                            <SelectItem value="mst">Mountain Standard Time</SelectItem>
                            <SelectItem value="est">Eastern Standard Time</SelectItem>
                            <SelectItem value="gmt">Greenwich Mean Time</SelectItem>
                            <SelectItem value="ist">Indian Standard Time</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className='font-headline'>Notifications</CardTitle>
                <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                    <Checkbox id="email-notifications" defaultChecked />
                    <div className="grid gap-1.5 leading-none">
                        <label
                        htmlFor="email-notifications"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                        Email Notifications
                        </label>
                        <p className="text-sm text-muted-foreground">
                        Receive an email when a reminder is sent or fails.
                        </p>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                    <Checkbox id="push-notifications" />
                     <div className="grid gap-1.5 leading-none">
                        <label
                        htmlFor="push-notifications"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                        Push Notifications
                        </label>
                        <p className="text-sm text-muted-foreground">
                        Get push notifications on your devices (coming soon).
                        </p>
                    </div>
                </div>
                 <div className="flex items-center justify-between space-x-2 pt-4">
                    <Label htmlFor="notification-sound" className="flex flex-col space-y-1">
                        <span>Notification Sound</span>
                        <span className="font-normal text-sm text-muted-foreground">
                         Play a sound for new notifications.
                        </span>
                    </Label>
                    <Switch id="notification-sound" />
                </div>
            </CardContent>
        </Card>
        
        <div className='flex justify-start'>
            <Button onClick={handleSaveChanges}>Save All Changes</Button>
        </div>
    </div>
  );
}
