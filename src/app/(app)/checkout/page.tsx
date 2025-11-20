'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { subscriptionPlans } from '@/lib/mock-data';
import { ArrowLeft, CreditCard, Lock, Mail, User, MapPin, Calendar, Building } from 'lucide-react';
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const planName = searchParams.get('plan') || 'Growth';
    const plan = subscriptionPlans.find(p => p.name === planName);

    if (!plan) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-lg text-muted-foreground">Plan not found.</p>
                <Button onClick={() => router.push('/pricing')} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Pricing
                </Button>
            </div>
        );
    }
    
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        toast({
            title: 'Processing Payment...',
            description: 'Please wait while we confirm your subscription.',
        });

        setTimeout(() => {
            toast({
                title: 'Payment Successful!',
                description: `You've subscribed to the ${plan?.name} plan.`,
            });
            router.push('/dashboard');
            setIsSubmitting(false);
        }, 2000);
    }

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in-0 duration-500 space-y-6">
            <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
            
            <div className="text-center">
                <h1 className="text-3xl font-headline font-bold tracking-tight">
                    Secure Checkout
                </h1>
                <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                    You're just one step away from unlocking powerful features.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Billing Information</CardTitle>
                        <CardDescription>Enter your billing details below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="name" placeholder="John Doe" className="pl-9" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="email" type="email" placeholder="name@example.com" className="pl-9" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Billing Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="address" placeholder="123 Main St, Anytown" className="pl-9" />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="india">India</SelectItem>
                                    <SelectItem value="usa">United States</SelectItem>
                                    <SelectItem value="uk">United Kingdom</SelectItem>
                                    <SelectItem value="canada">Canada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
                
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Plan</span>
                                <span className="font-semibold">{plan.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Price</span>
                                <span className="font-semibold">{plan.price}{plan.pricePeriod}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
                                <span>Total</span>
                                <span>{plan.price}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Payment Details</CardTitle>
                             <CardDescription>All transactions are secure and encrypted.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="card-number">Card Number</Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="card-number" placeholder="•••• •••• •••• ••••" className="pl-9" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="expiry">Expiry</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="expiry" placeholder="MM/YY" className="pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cvc">CVC</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="cvc" placeholder="•••" className="pl-9" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <form onSubmit={handleSubmit}>
                        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
                           Pay {plan.price} and Subscribe
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
