'use client';

import { Bar, BarChart as RechartsBarChart } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartYAxis, ChartXAxis } from "@/components/ui/chart"

const chartData = [
    { month: 'Jan', groceries: 400, dining: 240, transport: 80 },
    { month: 'Feb', groceries: 300, dining: 139, transport: 90 },
    { month: 'Mar', groceries: 200, dining: 380, transport: 120 },
    { month: 'Apr', groceries: 278, dining: 290, transport: 70 },
    { month: 'May', groceries: 189, dining: 480, transport: 150 },
    { month: 'Jun', groceries: 239, dining: 380, transport: 60 },
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
                <ChartXAxis dataKey="month" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartYAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="groceries" fill="var(--color-groceries)" radius={4} />
                <Bar dataKey="dining" fill="var(--color-dining)" radius={4} />
                <Bar dataKey="transport" fill="var(--color-transport)" radius={4} />
            </RechartsBarChart>
        </ChartContainer>
    );
}
