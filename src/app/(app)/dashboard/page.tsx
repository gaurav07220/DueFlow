import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { dashboardStats, remindersChartData, mockReminders } from '@/lib/mock-data';
import { BellRing, CheckCircle, Clock, LineChart } from 'lucide-react';
import { RemindersChart } from './components/reminders-chart';
import { RecentReminders } from './components/recent-reminders';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-headline font-bold tracking-tight">
          Welcome back, Alex!
        </h1>
        <p className="text-muted-foreground">
          Here's a summary of your follow-up activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">Sent Reminders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.sentReminders}</div>
            <p className="text-xs text-muted-foreground">+5 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.pendingReminders}</div>
            <p className="text-xs text-muted-foreground">Waiting to be sent</p>
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <LineChart className="h-4 w-4 text-primary-foreground/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.conversions}</div>
            <p className="text-xs text-primary-foreground/70">+20% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className='font-headline'>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <RemindersChart data={remindersChartData} />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle className='font-headline'>Recent Reminders</CardTitle>
            <CardDescription>
              You have {mockReminders.filter(r => r.status === 'pending').length} pending reminders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentReminders reminders={mockReminders} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
