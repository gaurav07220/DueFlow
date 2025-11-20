
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockUser } from '@/lib/mock-data';

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in-0 duration-500">
       <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your account details.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className='font-headline'>Public Profile</CardTitle>
          <CardDescription>
            This information will be displayed publicly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
              <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className='flex-1'>
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input id="avatar" defaultValue={mockUser.avatarUrl} />
            </div>
            <Button variant="outline" className='self-end'>Change</Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={mockUser.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={mockUser.email} disabled />
          </div>
          <Button>Update Profile</Button>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle className='font-headline'>Password</CardTitle>
          <CardDescription>
            Change your password here.
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
          <Button>Change Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
