
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockUser } from '@/lib/mock-data';
import { getInitials } from '@/lib/utils';

export default function ProfilePage() {
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
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback>{getInitials(mockUser.name)}</AvatarFallback>
            </Avatar>
            <div className='flex-1 min-w-[200px]'>
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input id="avatar" defaultValue={mockUser.avatarUrl} />
            </div>
            <Button variant="outline" className='self-end'>Change</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={mockUser.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input id="business-name" defaultValue={mockUser.businessName} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
              <Input id="phone" type="tel" defaultValue="+1 123 456 7890" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={mockUser.email} disabled />
            </div>
          </div>
        </CardContent>
         <CardFooter className='border-t pt-6'>
          <Button>Update Profile</Button>
        </CardFooter>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className='font-headline'>Change Password</CardTitle>
          <CardDescription>
            For security, please choose a strong password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </CardContent>
        <CardFooter className='border-t pt-6'>
          <Button>Change Password</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
