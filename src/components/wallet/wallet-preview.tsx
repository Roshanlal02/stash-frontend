'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGoogleWallet, WalletVoucher } from '@/lib/google-wallet-api';
import { useMockUserData } from '@/lib/mock-data-api';
import { Gift, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export function WalletPreview() {
  const [featuredVouchers, setFeaturedVouchers] = useState<WalletVoucher[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { getAvailableVouchers } = useGoogleWallet();
  const { fetchUserProgress } = useMockUserData();

  useEffect(() => {
    loadWalletPreview();
  }, []);

  const loadWalletPreview = async () => {
    try {
      const [vouchers, userProgress] = await Promise.all([
        getAvailableVouchers(),
        fetchUserProgress()
      ]);

      // Get top 3 most popular vouchers that user can afford
      const calculatedPoints = (userProgress.level * 500) + userProgress.xp;
      const affordableVouchers = vouchers
        .filter(v => v.pointsCost <= calculatedPoints)
        .sort((a, b) => a.popularityRank - b.popularityRank)
        .slice(0, 3);

      setFeaturedVouchers(affordableVouchers);
      setUserPoints(calculatedPoints);
    } catch (error) {
      console.error('Failed to load wallet preview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading rewards...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Google Wallet Rewards
            </CardTitle>
            <CardDescription>Redeem your points for amazing vouchers</CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-lg font-bold">{userPoints.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground">Available Points</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {featuredVouchers.length === 0 ? (
          <div className="text-center py-6">
            <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              Keep earning points to unlock amazing rewards!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {featuredVouchers.map((voucher) => (
                <div key={voucher.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{voucher.title}</h4>
                      {voucher.popularityRank <= 3 && (
                        <Badge variant="secondary" className="text-xs">Popular</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ₹{voucher.value} • {voucher.pointsCost} points
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Redeem
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="pt-2">
              <Button asChild variant="default" className="w-full gap-2">
                <Link href="/wallet">
                  View All Rewards
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
