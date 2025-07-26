import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Star, Shield, Zap } from 'lucide-react';
import { SpendingChart } from '@/components/stats/spending-chart';

const badges = [
  { id: 1, name: 'First Scan', description: 'Scanned your first receipt.', icon: Trophy },
  { id: 2, name: 'Budget Master', description: 'Stayed within budget for a month.', icon: Shield },
  { id: 3, name: 'Super Saver', description: 'Saved over ₹40,000 in a month.', icon: Star },
  { id: 4, name: 'Anomaly Hunter', description: 'Detected 5 spending anomalies.', icon: Zap },
  { id: 5, name: 'Monthly Streak', description: 'Used the app every day for a month.', icon: Trophy },
];

export default function StatsPage() {
    return (
        <div className="space-y-4 sm:space-y-6 w-full min-w-0 max-w-7xl mx-auto">
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle>Spending Statistics</CardTitle>
                    <CardDescription>Your spending breakdown for the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent className="min-w-0 p-4 sm:p-6">
                    <div className="overflow-x-auto">
                        <SpendingChart />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-4">
                    <CardTitle>Your Badges</CardTitle>
                    <CardDescription>Achievements and milestones you've unlocked.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {badges.map((badge) => (
                        <div key={badge.id} className="flex flex-col items-center text-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
                            <div className="p-3 bg-muted rounded-full mb-3 shrink-0">
                                <badge.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2">{badge.name}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{badge.description}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
