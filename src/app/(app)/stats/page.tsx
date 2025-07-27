'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Trophy, Star, Shield, Zap, RefreshCw, AlertCircle, TrendingUp, Receipt, DollarSign } from 'lucide-react';
import { SpendingChart } from '@/components/stats/spending-chart';
import { useSpendingReport, AnalyticsAPIError } from '@/lib/analytics-api';
import { useToast } from '@/hooks/use-toast';

const badges = [
  { id: 1, name: 'First Scan', description: 'Scanned your first receipt.', icon: Trophy },
  { id: 2, name: 'Budget Master', description: 'Stayed within budget for a month.', icon: Shield },
  { id: 3, name: 'Super Saver', description: 'Saved over ₹40,000 in a month.', icon: Star },
  { id: 4, name: 'Anomaly Hunter', description: 'Detected 5 spending anomalies.', icon: Zap },
  { id: 5, name: 'Monthly Streak', description: 'Used the app every day for a month.', icon: Trophy },
];

export default function StatsPage() {
  const [spendingData, setSpendingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { fetchSpendingReport } = useSpendingReport();
  const { toast } = useToast();

  const loadSpendingReport = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchSpendingReport();
      
      if (result.success && result.data) {
        setSpendingData(result.data);
        toast({
          title: "Analytics Loaded",
          description: "Your spending report has been updated.",
          duration: 3000,
        });
      } else if (result.error) {
        setError(result.error.message);
        
        // Show specific error messages
        switch (result.error.code) {
          case 'NO_DATA_FOUND':
            toast({
              title: "No Data Available",
              description: "Start uploading receipts to see your spending analytics.",
              variant: "default",
              duration: 5000,
            });
            break;
          case 'NETWORK_ERROR':
            toast({
              title: "Connection Error",
              description: "Please check your internet connection and try again.",
              variant: "destructive",
              duration: 5000,
            });
            break;
          default:
            toast({
              title: "Failed to Load Analytics",
              description: result.error.message,
              variant: "destructive",
              duration: 5000,
            });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadSpendingReport();
  };

  useEffect(() => {
    loadSpendingReport();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 w-full min-w-0 max-w-7xl mx-auto">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Loading Analytics...
            </CardTitle>
            <CardDescription>Fetching your spending insights and report.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Loading skeleton */}
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error && !spendingData) {
    return (
      <div className="space-y-4 sm:space-y-6 w-full min-w-0 max-w-7xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to Load Analytics</AlertTitle>
          <AlertDescription className="mb-4">
            {error}
          </AlertDescription>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again {retryCount > 0 && `(${retryCount})`}
          </Button>
        </Alert>
      </div>
    );
  }
  // Success state with data
  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0 max-w-7xl mx-auto">
      {/* AI-Generated Insights */}
      {spendingData && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AI Spending Insights
                </CardTitle>
                <CardDescription>Personalized recommendations based on your spending patterns.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {spendingData.report}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spending Summary Cards */}
      {spendingData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">₹{spendingData.totalSpent.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Receipt className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{spendingData.receiptCount}</p>
                  <p className="text-sm text-muted-foreground">Receipts Processed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">
                    ₹{spendingData.receiptCount > 0 ? Math.round(spendingData.totalSpent / spendingData.receiptCount).toLocaleString('en-IN') : '0'}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg. per Receipt</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Receipts */}
      {spendingData && spendingData.receipts && spendingData.receipts.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Recent Receipts</CardTitle>
            <CardDescription>Your latest spending activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {spendingData.receipts.map((receipt: any) => (
                <div key={receipt.receiptId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Receipt className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{receipt.merchant}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(receipt.timestamp).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{parseFloat(receipt.total).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spending Chart */}
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

      {/* Badges */}
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

      {/* Empty state for no data */}
      {spendingData && spendingData.receiptCount === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Receipts Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start uploading receipts to see your spending analytics and insights.
            </p>
            <Button onClick={() => window.location.href = '/receipts'}>
              Upload Your First Receipt
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
