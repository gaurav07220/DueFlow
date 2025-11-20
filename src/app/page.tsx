import { redirect } from 'next/navigation';

export default function RootPage() {
  // In a real app, you'd have logic here to check for an auth token.
  // If the user is not logged in, you would redirect to '/login'.
  // If they are logged in, you would redirect to '/dashboard'.
  // For this MVP, we'll assume the user is logged in and send them to the dashboard.
  redirect('/dashboard');
}
