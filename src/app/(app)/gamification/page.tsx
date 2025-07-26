import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Star, Target, Crown } from "lucide-react";
import { PixelatedCastle } from "@/components/gamification/pixel-castle";
import { motion } from "framer-motion";

const userProgress = {
    level: 5,
    xp: 650,
    xpForNextLevel: 1000,
    scanStreak: 7,
    budgetStreak: 2,
};

const levels = [
    { id: 1, name: "January Savings", goal: 100, status: "completed" },
    { id: 2, name: "February Frugality", goal: 150, status: "completed" },
    { id: 3, name: "March Moolah", goal: 200, status: "completed" },
    { id: 4, name: "April Accumulation", goal: 250, status: "active" },
    { id: 5, name: "May Money", goal: 300, status: "locked" },
    { id: 6, name: "June Journey", goal: 350, status: "locked" },
];

export default function GamificationPage() {
    
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Your Progress</CardTitle>
                    <CardDescription>Keep up the great work! Here's how you're doing.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Star className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Level</p>
                            <p className="text-2xl font-bold">{userProgress.level}</p>
                        </div>
                    </div>
                    <div className="col-span-1 lg:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground text-center mb-1">XP to Next Level</p>
                        <Progress value={(userProgress.xp / userProgress.xpForNextLevel) * 100} />
                        <p className="text-sm text-muted-foreground text-center mt-1">{userProgress.xp} / {userProgress.xpForNextLevel} XP</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-accent/20 rounded-full">
                            <Flame className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Scan Streak</p>
                            <p className="text-2xl font-bold">{userProgress.scanStreak} days</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Kingdom</CardTitle>
                        <CardDescription>Your savings are building a magnificent castle.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-square bg-blue-100 dark:bg-gray-900/50 rounded-lg overflow-hidden flex items-center justify-center p-4">
                           <PixelatedCastle level={userProgress.level} />
                        </div>
                        <p className="text-center text-sm text-muted-foreground mt-2">Level {userProgress.level} Castle</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Levels Map</CardTitle>
                        <CardDescription>Complete monthly savings goals to progress.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {levels.map((level, index) => (
                                <div key={level.id} className="flex items-center space-x-4">
                                    <div className={`relative flex h-10 w-10 items-center justify-center rounded-full ${level.status === 'completed' ? 'bg-primary text-primary-foreground' : level.status === 'active' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                                        {level.status === 'completed' ? <Star className="h-6 w-6" /> : <Target className="h-6 w-6" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-semibold ${level.status === 'locked' ? 'text-muted-foreground' : ''}`}>{level.name}</p>
                                        <p className={`text-sm ${level.status === 'locked' ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>Goal: Save ${level.goal}</p>
                                    </div>
                                    {level.id === userProgress.level && <Crown className="h-6 w-6 text-yellow-500" />}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
