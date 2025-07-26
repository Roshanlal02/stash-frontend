import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Star, Shield, Zap } from 'lucide-react';
import { SpendingChart } from '@/components/stats/spending-chart';

const badges = [
  { id: 1, name: 'First Scan', description: 'Scanned your first receipt.', icon: Trophy },
  { id: 2, name: 'Budget Master', description: 'Stayed within budget for a month.', icon: Shield },
  { id: 3, name: 'Super Saver', description: 'Saved over $500 in a month.', icon: Star },
  { id: 4, name: 'Anomaly Hunter', description: 'Detected 5 spending anomalies.', icon: Zap },
  { id: 5, name: 'Monthly Streak', description: 'Used the app every day for a month.', icon: Trophy },
];

export default function StatsPage() {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Spending Statistics</CardTitle>
                    <CardDescription>Your spending breakdown for the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SpendingChart />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Badges</CardTitle>
                    <CardDescription>Achievements and milestones you've unlocked.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {badges.map((badge) => (
                        <div key={badge.id} className="flex flex-col items-center text-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
                            <div className="p-4 bg-muted rounded-full mb-3">
                                <badge.icon className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg">{badge.name}</h3>
                            <p className="text-sm text-muted-foreground">{badge.description}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
