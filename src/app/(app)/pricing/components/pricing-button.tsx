'use client';

import { Button } from '@/components/ui/button';

type PricingButtonProps = {
  planName: string;
  isSelected: boolean;
  onClick?: () => void;
};

export function PricingButton({ planName, isSelected, onClick }: PricingButtonProps) {
  const text = planName === 'Free' ? 'Get Started' : `Upgrade to ${planName}`;
  return (
    <Button
      onClick={onClick}
      variant={isSelected ? 'default' : 'outline'}
      size="default"
      className="w-full"
    >
      {text}
    </Button>
  );
}
