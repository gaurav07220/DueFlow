'use client';

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
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
        <AreaChart 
          accessibilityLayer 
          data={data}
          margin={{
            left: -20,
            right: 20,
            top: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip
            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
            content={<ChartTooltipContent 
              indicator='dot'
              labelClassName='font-bold text-lg'
              className='rounded-xl shadow-lg border-border/50 bg-background/80 backdrop-blur-sm' 
            />} 
          />
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area
            dataKey="total"
            type="monotone"
            fill="url(#colorTotal)"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{
              r: 4,
              strokeWidth: 2,
              fill: 'hsl(var(--background))',
              stroke: 'hsl(var(--primary))'
            }}
            activeDot={{
              r: 6,
              strokeWidth: 2,
              fill: 'hsl(var(--background))',
              stroke: 'hsl(var(--primary))'
            }}
          />
        </AreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}