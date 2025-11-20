
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { subscriptionPlans } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <div className="text-center">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Find the perfect plan
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Start for free and scale up as your business grows. All plans include our core features.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.name} className={cn('flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1', plan.highlighted && 'border-primary ring-2 ring-primary')}>
            <CardHeader className={cn(plan.highlighted && 'bg-primary/5')}>
              <CardTitle className='font-headline'>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.pricePeriod}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.highlighted ? 'default' : 'outline'}>
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
