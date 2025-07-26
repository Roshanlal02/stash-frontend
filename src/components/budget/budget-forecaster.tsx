'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { budgetForecaster } from '@/ai/flows/budget-forecaster';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';

type ForecastResult = {
    forecast: string;
    savingApproaches: string;
};

export function BudgetForecaster() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ForecastResult | null>(null);
    const { toast } = useToast();

    const handleForecast = async () => {
        setIsLoading(true);
        setResult(null);

        const receiptHistory = `
            2024-07-01, SuperMart, 120.50
            2024-07-05, Gas Station, 45.00
            2024-07-10, Movie Theater, 35.00
            2024-07-15, SuperMart, 95.75
            2024-07-20, Fancy Restaurant, 150.00
        `;
        const spendingPatterns = 'User spends approx $400/month on groceries, $100 on gas, and $200 on entertainment.';

        try {
            const forecastResult = await budgetForecaster({ receiptHistory, spendingPatterns });
            setResult(forecastResult);
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to generate forecast.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto">
            <Card className="w-full">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                           <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                           <CardTitle className="text-2xl">AI Budget Forecaster</CardTitle>
                           <CardDescription>Get a glimpse into your future spending and find ways to save.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!result && !isLoading && (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-muted-foreground">Ready to see your financial future?</h3>
                            <p className="text-muted-foreground mb-4">Click the button below to generate your personalized budget forecast.</p>
                             <Button onClick={handleForecast} size="lg">
                                <Wand2 className="mr-2 h-5 w-5" />
                                Generate Forecast
                            </Button>
                        </div>
                    )}
                    {isLoading && (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="ml-4 text-muted-foreground">Our AI is crunching the numbers...</p>
                        </div>
                    )}
                    {result && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Forecast</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{result.forecast}</p>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle>Saving Approaches</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{result.savingApproaches}</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </CardContent>
                {result && (
                     <CardFooter>
                        <Button onClick={handleForecast} disabled={isLoading} className="mx-auto">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                            Regenerate Forecast
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
