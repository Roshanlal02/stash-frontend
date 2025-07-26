import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Activity, ArrowUpRight, CreditCard, DollarSign, AlertCircle, ShoppingCart, Flame, Star, Target, Crown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PixelatedCastle } from "@/components/gamification/pixel-castle";
import castlePng from "./castle.png";

const userProgress = {
    level: 5,
    xp: 650,
    xpForNextLevel: 1000,
    scanStreak: 7,
    budgetStreak: 2,
};

const levels = [
    { id: 1, name: "January Savings", goal: 8000, status: "completed" },
    { id: 2, name: "February Frugality", goal: 12000, status: "completed" },
    { id: 3, name: "March Moolah", goal: 16000, status: "completed" },
    { id: 4, name: "April Accumulation", goal: 20000, status: "active" },
    { id: 5, name: "May Money", goal: 25000, status: "locked" },
    { id: 6, name: "June Journey", goal: 30000, status: "locked" },
];

export default function DashboardPage() {
    return (
        <div className="space-y-4 sm:space-y-6 w-full min-w-0 max-w-7xl mx-auto">
            {/* Stats Overview */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
                        <span className="h-4 w-4 text-muted-foreground font-bold">₹</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">₹3,57,650</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">₹42,350</div>
                        <p className="text-xs text-muted-foreground">of ₹4,00,000 budget</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Level</CardTitle>
                        <Star className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{userProgress.level}</div>
                        <p className="text-xs text-muted-foreground">+1 from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Scan Streak</CardTitle>
                        <Flame className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{userProgress.scanStreak}</div>
                        <p className="text-xs text-muted-foreground">days in a row</p>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Section */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle>Your Progress</CardTitle>
                    <CardDescription>Keep up the great work! Here's how you're doing.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* XP Progress Section */}
                    <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium text-muted-foreground text-center">XP to Next Level</p>
                        <Progress value={(userProgress.xp / userProgress.xpForNextLevel) * 100} className="h-3" />
                        <p className="text-sm text-muted-foreground text-center">{userProgress.xp} / {userProgress.xpForNextLevel} XP</p>
                    </div>
                </CardContent>
            </Card>

            <Alert className="bg-accent/20 border-accent/50 text-accent-foreground [&>svg]:text-yellow-500">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-sm">Anomaly Detected!</AlertTitle>
                <AlertDescription className="text-xs sm:text-sm">
                    Unusually high spending of ₹20,000 at "Luxury Cafe" detected. This is 300% higher than your average coffee shop visit.
                </AlertDescription>
            </Alert>

            {/* Gamification Section */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Your Kingdom</CardTitle>
                        <CardDescription>Your savings are building a magnificent castle.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative aspect-square bg-blue-100 dark:bg-gray-900/50 rounded-lg overflow-hidden flex items-center justify-center p-4">
                           <PixelatedCastle level={userProgress.level} />
                           
                           {/* Goal Overlay Window with Next Level Castle */}
                           <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-md p-2 w-16 h-16">
                               {(() => {
                                   const nextLevel = levels.find(level => level.id === userProgress.level + 1);
                                   if (nextLevel) {
                                       return (
                                           <div className="w-full h-full flex items-center justify-center">
                                               <img 
                                                   src={castlePng.src}
                                                   alt="Next Level Castle" 
                                                   className="w-full h-full object-contain"
                                               />
                                           </div>
                                       );
                                   } else {
                                       return (
                                           <div className="w-full h-full flex items-center justify-center">
                                               <div className="text-center">
                                                   <div className="text-yellow-400 text-lg">👑</div>
                                                   <div className="text-xs text-white font-bold">MAX</div>
                                               </div>
                                           </div>
                                       );
                                   }
                               })()}
                           </div>
                        </div>
                        <p className="text-center text-sm text-muted-foreground mt-2">Level {userProgress.level} Castle</p>
                    </CardContent>
                </Card>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Levels Progress</CardTitle>
                        <CardDescription>Complete monthly savings goals to progress.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            {levels.slice(0, 4).map((level, index) => (
                                <div key={level.id} className="flex items-center space-x-3 p-3 rounded-lg border bg-card/50">
                                    <div className={`relative flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${level.status === 'completed' ? 'bg-primary text-primary-foreground' : level.status === 'active' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                                        {level.status === 'completed' ? <Star className="h-4 w-4" /> : <Target className="h-4 w-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-semibold truncate text-xs ${level.status === 'locked' ? 'text-muted-foreground' : ''}`}>{level.name}</p>
                                        <p className={`text-xs ${level.status === 'locked' ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>₹{level.goal.toLocaleString('en-IN')}</p>
                                    </div>
                                    {level.id === userProgress.level && <Crown className="h-4 w-4 text-yellow-500 shrink-0" />}
                                </div>
                            ))}
                        </div>
                        <Button asChild variant="outline" size="sm" className="w-full">
                            <Link href="/stats">View All Levels</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 lg:gap-6 grid-cols-1">
                <Card className="min-w-0">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="grid gap-2 flex-1">
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>Recent transactions from your scanned receipts.</CardDescription>
                        </div>
                        <Button asChild size="sm" className="gap-1 shrink-0 w-full sm:w-auto">
                            <Link href="/receipts">
                                View All
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[140px] px-4">Merchant</TableHead>
                                        <TableHead className="hidden md:table-cell min-w-[100px]">Category</TableHead>
                                        <TableHead className="hidden lg:table-cell min-w-[100px]">Date</TableHead>
                                        <TableHead className="text-right min-w-[100px] px-4">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="px-4">
                                            <div className="font-medium">Luxury Cafe</div>
                                            <div className="text-xs text-muted-foreground md:hidden">Dining • 2024-07-29</div>
                                            <div className="hidden text-xs text-muted-foreground md:inline lg:hidden">Unusual spend</div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-sm">Dining</TableCell>
                                        <TableCell className="hidden lg:table-cell text-sm">2024-07-29</TableCell>
                                        <TableCell className="text-right px-4 font-medium">₹20,000.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="px-4">
                                            <div className="font-medium">Tech Gadgets Inc.</div>
                                            <div className="text-xs text-muted-foreground md:hidden">Electronics • 2024-07-28</div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-sm">Electronics</TableCell>
                                        <TableCell className="hidden lg:table-cell text-sm">2024-07-28</TableCell>
                                        <TableCell className="text-right px-4 font-medium">₹41,250.00</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
