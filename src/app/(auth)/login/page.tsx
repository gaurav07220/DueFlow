
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Package } from 'lucide-react';
import React from 'react';

const GoogleIcon = () => (
    <svg viewBox="0 0 48 48" className="size-5">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 12.04C34.553 7.79 29.548 5 24 5C13.438 5 5 13.438 5 24s8.438 19 19 19s19-8.438 19-19c0-1.396-.143-2.761-.409-4.089z"></path>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.553 7.79 29.548 5 24 5C17.661 5 12.012 8.441 8.046 13.5l-1.74-1.166z"></path>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.223 0-9.65-3.657-11.303-8.5H6.306v.003C10.22 41.516 16.634 44 24 44z"></path>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.034 12.034 0 0 1-11.303 8 11.9 11.9 0 0 1-11.303-8.5h-6.306v.003c3.984 6.096 10.402 8.497 17.609 8.497 6.627 0 12-5.373-12-12c0-1.396-.143-2.761-.409-4.089z"></path>
    </svg>
  );

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log(values);

    setTimeout(() => {
      toast({
        title: 'Login Successful',
        description: "Welcome back! Redirecting you to the dashboard...",
      });
      router.push('/dashboard');
      setIsSubmitting(false);
    }, 1000);
  }

  function onGoogleSignIn() {
    setIsGoogleSubmitting(true);
    toast({
      title: 'Signing in with Google...',
      description: "You'll be redirected shortly.",
    });
    setTimeout(() => {
      router.push('/dashboard');
      setIsGoogleSubmitting(false);
    }, 1000);
  }

  return (
    <Card className="w-full max-w-sm border-0 bg-transparent shadow-none sm:border sm:bg-card sm:shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10 p-4 w-20 h-20">
          <Package className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl">Welcome to DueFlow</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="#"
                        className="ml-auto inline-block text-xs text-primary underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full font-headline" loading={isSubmitting}>
              Sign In
            </Button>
          </form>
        </Form>
        <Separator className="my-6" />
        <Button variant="outline" className="w-full font-headline" onClick={onGoogleSignIn} loading={isGoogleSubmitting}>
            <GoogleIcon />
            <span>Sign in with Google</span>
        </Button>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
