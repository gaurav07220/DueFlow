import { useState } from 'react';
import { mockUser } from '@/lib/mock-data';
import type { User } from '@/lib/types';

// This is a mock hook. In a real app, you would fetch the user's subscription
// status from your backend or a service like RevenueCat.
export function useSubscription() {
  const [subscription] = useState<User['subscription']>(mockUser.subscription);

  const isPro = subscription === 'pro' || subscription === 'enterprise';
  const isEnterprise = subscription === 'enterprise';

  return { subscription, isPro, isEnterprise };
}
