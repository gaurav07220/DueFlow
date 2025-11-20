'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

type RemindersChartProps = {
  data: { name: string; total: number }[];
};

export function RemindersChart({ data }: RemindersChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <ChartContainer
        config={{
          total: {
            label: 'Reminders',
            color: 'hsl(var(--primary))',
          },
        }}
      >
        <BarChart accessibilityLayer data={data} >
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar
            dataKey="total"
            fill="var(--color-total)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
