
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ChartData {
  date: string;
  requests: number;
  successful: number;
  failed: number;
}

interface AnalyticsChartProps {
  data: ChartData[];
  type?: 'area' | 'line';
  height?: number;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ 
  data, 
  type = 'area',
  height = 300 
}) => {
  const chartConfig = {
    requests: {
      label: "Total Requests",
      color: "hsl(142, 76%, 36%)",
    },
    successful: {
      label: "Successful",
      color: "hsl(142, 69%, 58%)",
    },
    failed: {
      label: "Failed",
      color: "hsl(0, 84%, 60%)",
    },
  };

  return (
    <ChartContainer config={chartConfig} className={`h-[${height}px]`}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="requests"
              stackId="1"
              stroke="var(--color-requests)"
              fill="var(--color-requests)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="successful"
              stackId="2"
              stroke="var(--color-successful)"
              fill="var(--color-successful)"
              fillOpacity={0.1}
              strokeWidth={1}
            />
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="requests"
              stroke="var(--color-requests)"
              strokeWidth={3}
              dot={{ fill: "var(--color-requests)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="successful"
              stroke="var(--color-successful)"
              strokeWidth={2}
              dot={{ fill: "var(--color-successful)", strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default AnalyticsChart;
