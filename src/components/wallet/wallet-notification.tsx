'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGoogleWallet } from '@/lib/google-wallet-api';
import { useMockUserData } from '@/lib/mock-data-api';
import { Gift, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface WalletNotificationProps {
  points: number;
  totalPoints: number;
  onDismiss?: () => void;
}

export function WalletNotification({ points, totalPoints, onDismiss }: WalletNotificationProps) {
  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { getAvailableVouchers } = useGoogleWallet();

  useEffect(() => {
    // Only show notification if user has enough points for at least one voucher
    if (totalPoints >= 1000) {
      loadAffordableVouchers();
    }
  }, [totalPoints]);

  const loadAffordableVouchers = async () => {
    try {
      const vouchers = await getAvailableVouchers();
      const affordable = vouchers
        .filter(v => v.pointsCost <= totalPoints)
        .sort((a, b) => a.pointsCost - b.pointsCost)
        .slice(0, 2); // Show top 2 most affordable

      if (affordable.length > 0) {
        setAvailableVouchers(affordable);
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Failed to load vouchers for notification:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible || availableVouchers.length === 0) {
    return null;
  }

  return (
    <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full shrink-0">
              <Gift className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-green-800 dark:text-green-200">
                  🎉 Rewards Available!
                </h4>
                <Badge variant="secondary" className="text-xs">
                  +{points} points
                </Badge>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                You have {totalPoints.toLocaleString()} points! You can now redeem:
              </p>
              <div className="space-y-1">
                {availableVouchers.map((voucher) => (
                  <div key={voucher.id} className="text-xs text-green-600 dark:text-green-400">
                    • {voucher.title} ({voucher.pointsCost} points)
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button asChild size="sm" className="text-xs">
              <Link href="/wallet">
                <ExternalLink className="h-3 w-3 mr-1" />
                Redeem
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook to manage wallet notifications
export function useWalletNotifications() {
  const [notifications, setNotifications] = useState<WalletNotificationProps[]>([]);

  const addNotification = (points: number, totalPoints: number) => {
    const notification: WalletNotificationProps = {
      points,
      totalPoints,
      onDismiss: () => removeNotification(totalPoints),
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      removeNotification(totalPoints);
    }, 10000);
  };

  const removeNotification = (totalPoints: number) => {
    setNotifications(prev => prev.filter(n => n.totalPoints !== totalPoints));
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
}
