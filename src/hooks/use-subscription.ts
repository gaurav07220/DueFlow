
'use client';

import { useState, useEffect } from 'react';
import { useDoc, useFirebase, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function useSubscription() {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const [subscription, setSubscription] = useState<'free' | 'pro' | 'enterprise' | null>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData } = useDoc<{subscriptionStatus: 'free' | 'pro' | 'enterprise'}>(userDocRef);

  useEffect(() => {
    if (userData) {
      setSubscription(userData.subscriptionStatus);
    }
  }, [userData]);


  const isPro = subscription === 'pro' || subscription === 'enterprise';
  const isEnterprise = subscription === 'enterprise';

  return { subscription, isPro, isEnterprise };
}
