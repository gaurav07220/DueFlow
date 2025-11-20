'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type PricingButtonProps = {
  planName: string;
  isSelected: boolean;
};

export function PricingButton({ planName, isSelected }: PricingButtonProps) {
  const text = planName === 'Free' ? 'Get Started' : `Upgrade to ${planName}`;
  return (
    <Link
      href={`/checkout?plan=${planName}`}
      className={cn(
        buttonVariants({
          variant: isSelected ? 'default' : 'outline',
          size: 'default',
        }),
        'w-full'
      )}
    >
      {text}
    </Link>
  );
}
