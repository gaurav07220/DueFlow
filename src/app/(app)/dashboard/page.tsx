
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BellRing, Users, Clock, LineChart, PlusCircle } from 'lucide-react';
import { RemindersChart } from './components/reminders-chart';
import { RecentReminders } from './components/recent-reminders';
import { Button } from '@/components/ui/button';
import { AddContactDialog } from '../contacts/components/add-contact-dialog';
import { ScheduleReminderDialog } from '../reminders/components/schedule-reminder-dialog';
import { useCollection, useFirebase, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import type { Reminder, Contact } from '@/lib/types';

export default function DashboardPage() {
  const { firestore } = useFirebase();
  const { user } = useUser();

  const contactsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'contacts'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const remindersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'reminders'), where('userId', '==', user.uid));
  }, [firestore, user]);
  
  const upcomingRemindersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'reminders'), 
      where('userId', '==', user.uid),
      where('status', '==', 'pending'), 
      orderBy('scheduledAt', 'asc'), 
      limit(5)
    );
  }, [firestore, user]);

  const { data: contacts } = useCollection<Contact>(contactsQuery);
  const { data: reminders } = useCollection<Reminder>(remindersQuery);
  const { data: upcomingReminders } = useCollection<Reminder>(upcomingRemindersQuery);
  
  const remindersChartData = [
    { name: 'Jan', total: 0 }, { name: 'Feb', total: 0 }, { name: 'Mar', total: 0 },
    { name: 'Apr', total: 0 }, { name: 'May', total: 0 }, { name: 'Jun', total: 0 },
    { name: 'Jul', total: 0 }, { name: 'Aug', total: 0 }, { name: 'Sep', total: 0 },
    { name: 'Oct', total: 0 }, { name: 'Nov', total: 0 }, { name: 'Dec', total: 0 },
  ];

  if(reminders) {
    for (const reminder of reminders) {
        if (reminder.scheduledAt) {
            const month = new Date(reminder.scheduledAt).getMonth();
            remindersChartData[month].total++;
        }
    }
  }


  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Welcome back, {user?.displayName || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            Here's a summary of your follow-up activity.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
            <AddContactDialog>
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </AddContactDialog>
            <ScheduleReminderDialog>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Reminder
              </Button>
            </ScheduleReminderDialog>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">All your managed contacts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reminders</CardTitle>
            <BellRing className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reminders?.length || 0}</div>
            <p className="text-xs text-muted-foreground">All reminders scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reminders?.filter(r => r.status === 'pending').length || 0}</div>
            <p className="text-xs text-muted-foreground">Today, tomorrow, overdue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments Received</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">INR {reminders?.filter(r => r.status === 'paid').length || 0 * 100}</div>
            <p className="text-xs text-muted-foreground">vs INR {reminders?.filter(r => r.status === 'pending').length || 0 * 50} pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className='font-headline'>Reminders Overview</CardTitle>
             <CardDescription>
              A visual breakdown of your scheduled reminders over the year.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RemindersChart data={remindersChartData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className='font-headline'>Upcoming Reminders</CardTitle>
            <CardDescription>
              Your next scheduled follow-ups.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentReminders reminders={upcomingReminders || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
