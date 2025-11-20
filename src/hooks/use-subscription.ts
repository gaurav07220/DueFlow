
'use client';

import { useState } from 'react';

export function useSubscription() {
  const [subscription] = useState<'free' | 'pro' | 'enterprise'>('pro');

  const isPro = subscription === 'pro' || subscription === 'enterprise';
  const isEnterprise = subscription === 'enterprise';

  return { subscription, isPro, isEnterprise };
}

    