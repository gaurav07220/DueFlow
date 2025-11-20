
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { dashboardStats, remindersChartData, mockReminders, mockContacts } from '@/lib/mock-data';
import { BellRing, Users, Clock, LineChart, PlusCircle } from 'lucide-react';
import { RemindersChart } from './components/reminders-chart';
import { RecentReminders } from './components/recent-reminders';
import { Button } from '@/components/ui/button';
import { AddContactDialog } from '../contacts/components/add-contact-dialog';
import { ScheduleReminderDialog } from '../reminders/components/schedule-reminder-dialog';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Welcome back!
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
            <div className="text-2xl font-bold">{mockContacts.length}</div>
            <p className="text-xs text-muted-foreground">All your managed contacts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reminders</CardTitle>
            <BellRing className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalReminders}</div>
            <p className="text-xs text-muted-foreground">All reminders scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReminders.filter(r => r.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">Today, tomorrow, overdue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments Received</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">INR {dashboardStats.conversions * 100}</div>
            <p className="text-xs text-muted-foreground">vs INR {dashboardStats.pendingReminders * 50} pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
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
            <RecentReminders reminders={mockReminders.filter(r => r.status === 'pending').sort((a,b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
