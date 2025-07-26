'use client';

import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

const chartData = [
    { month: 'Jan', groceries: 33000, dining: 20000, transport: 6500 },
    { month: 'Feb', groceries: 25000, dining: 11500, transport: 7500 },
    { month: 'Mar', groceries: 16500, dining: 31500, transport: 10000 },
    { month: 'Apr', groceries: 23000, dining: 24000, transport: 5800 },
    { month: 'May', groceries: 15500, dining: 40000, transport: 12500 },
    { month: 'Jun', groceries: 20000, dining: 31500, transport: 5000 },
];

const chartConfig = {
    groceries: {
      label: "Groceries",
      color: "hsl(var(--chart-1))",
    },
    dining: {
      label: "Dining",
      color: "hsl(var(--chart-2))",
    },
    transport: {
      label: "Transport",
      color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

export function SpendingChart() {
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-[350px]">
            <RechartsBarChart data={chartData} accessibilityLayer>
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `₹${new Intl.NumberFormat('en-IN', { notation: 'compact', compactDisplay: 'short' }).format(value)}`} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" formatter={(value) => `₹${value.toLocaleString('en-IN')}`}/>} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="groceries" fill="var(--color-groceries)" radius={4} />
                <Bar dataKey="dining" fill="var(--color-dining)" radius={4} />
                <Bar dataKey="transport" fill="var(--color-transport)" radius={4} />
            </RechartsBarChart>
        </ChartContainer>
    );
}
