import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, ArrowUpRight, CreditCard, DollarSign, Download, AlertCircle, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DashboardPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 md:gap-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$4,291.89</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$708.11</div>
                        <p className="text-xs text-muted-foreground">of $5,000 budget</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M12 6l4 6-8 6-4-6 8-6z"/><path d="M12 6v12"/></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">+1 from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Category</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Groceries</div>
                        <p className="text-xs text-muted-foreground">$1,204 this month</p>
                    </CardContent>
                </Card>
            </div>

            <Alert className="bg-accent/20 border-accent/50 text-accent-foreground [&gt;svg]:text-yellow-500">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Anomaly Detected!</AlertTitle>
                <AlertDescription>
                    Unusually high spending of $250 at "Luxury Cafe" detected. This is 300% higher than your average coffee shop visit.
                </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>Recent transactions from your scanned receipts.</CardDescription>
                        </div>
                        <Button asChild size="sm" className="ml-auto gap-1">
                            <Link href="/receipts">
                                View All
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Merchant</TableHead>
                                    <TableHead className="hidden xl:table-column">Category</TableHead>
                                    <TableHead className="hidden xl:table-column">Date</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <div className="font-medium">Luxury Cafe</div>
                                        <div className="hidden text-sm text-muted-foreground md:inline">Unusual spend</div>
                                    </TableCell>
                                    <TableCell className="hidden xl:table-column">Dining</TableCell>
                                    <TableCell className="hidden xl:table-column">2024-07-29</TableCell>
                                    <TableCell className="text-right">$250.00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <div className="font-medium">Tech Gadgets Inc.</div>
                                    </TableCell>
                                    <TableCell className="hidden xl:table-column">Electronics</TableCell>
                                    <TableCell className="hidden xl:table-column">2024-07-28</TableCell>
                                    <TableCell className="text-right">$499.99</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Receipt</CardTitle>
                        <CardDescription>Scan or upload a receipt to track your spending.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
                       <Download className="h-10 w-10 text-muted-foreground mb-4" />
                       <p className="text-sm text-muted-foreground mb-2">Drag &amp; drop or</p>
                        <Button>Browse Files</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
