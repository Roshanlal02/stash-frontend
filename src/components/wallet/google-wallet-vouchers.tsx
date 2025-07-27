'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useGoogleWallet, WalletVoucher, RedeemedVoucher } from '@/lib/google-wallet-api';
import { useMockUserData } from '@/lib/mock-data-api';
import { 
  Gift, 
  Star, 
  ShoppingCart, 
  Coffee, 
  Car, 
  Film, 
  Fuel, 
  Wallet,
  QrCode,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';

const categoryIcons = {
  food: Coffee,
  shopping: ShoppingCart,
  transport: Car,
  entertainment: Film,
  fuel: Fuel,
  general: Gift
};

const statusIcons = {
  active: CheckCircle,
  used: CheckCircle,
  expired: XCircle
};

const statusColors = {
  active: 'text-green-600',
  used: 'text-blue-600',
  expired: 'text-red-600'
};

export function GoogleWalletVouchers() {
  const [availableVouchers, setAvailableVouchers] = useState<WalletVoucher[]>([]);
  const [redeemedVouchers, setRedeemedVouchers] = useState<RedeemedVoucher[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVoucher, setSelectedVoucher] = useState<WalletVoucher | null>(null);
  const [showRedemptionDialog, setShowRedemptionDialog] = useState(false);

  const { 
    getAvailableVouchers, 
    redeemVoucher, 
    getUserVouchers, 
    addToGoogleWallet,
    checkWalletIntegration 
  } = useGoogleWallet();
  const { fetchUserProgress } = useMockUserData();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [vouchers, userVouchers, userProgress, walletStatus] = await Promise.all([
        getAvailableVouchers(),
        getUserVouchers(),
        fetchUserProgress(),
        checkWalletIntegration()
      ]);

      setAvailableVouchers(vouchers);
      setRedeemedVouchers(userVouchers);
      
      // Calculate user points (mock calculation based on level and XP)
      const calculatedPoints = (userProgress.level * 500) + userProgress.xp;
      setUserPoints(calculatedPoints);

      if (!walletStatus.isGoogleWalletAvailable) {
        toast({
          title: "Google Wallet Unavailable",
          description: "Google Wallet is not available on this device.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to load wallet data:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load voucher data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVouchers = selectedCategory === 'all' 
    ? availableVouchers 
    : availableVouchers.filter(v => v.category === selectedCategory);

  const handleRedeemVoucher = async (voucher: WalletVoucher) => {
    if (userPoints < voucher.pointsCost) {
      toast({
        title: "Insufficient Points",
        description: `You need ${voucher.pointsCost} points to redeem this voucher. You have ${userPoints} points.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedVoucher(voucher);
    setShowRedemptionDialog(true);
  };

  const confirmRedemption = async () => {
    if (!selectedVoucher) return;

    setIsRedeeming(true);
    try {
      const result = await redeemVoucher(selectedVoucher.id, userPoints);
      
      if (result.success && result.redeemedVoucher) {
        setUserPoints(result.remainingPoints);
        setRedeemedVouchers(prev => [result.redeemedVoucher!, ...prev]);
        
        toast({
          title: "Voucher Redeemed!",
          description: result.message || "Voucher has been successfully redeemed.",
        });

        // Try to add to Google Wallet
        try {
          const walletResult = await addToGoogleWallet(result.redeemedVoucher);
          if (walletResult.success) {
            toast({
              title: "Added to Google Wallet",
              description: "Your voucher has been added to Google Wallet!",
            });
          }
        } catch (walletError) {
          console.warn('Failed to add to Google Wallet:', walletError);
        }
      } else {
        toast({
          title: "Redemption Failed",
          description: result.error || "Failed to redeem voucher. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Redemption error:', error);
      toast({
        title: "Redemption Error",
        description: "An error occurred while redeeming the voucher.",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
      setShowRedemptionDialog(false);
      setSelectedVoucher(null);
    }
  };

  const handleAddToWallet = async (redeemedVoucher: RedeemedVoucher) => {
    try {
      const result = await addToGoogleWallet(redeemedVoucher);
      if (result.success) {
        if (result.walletUrl) {
          window.open(result.walletUrl, '_blank');
        }
        toast({
          title: "Added to Google Wallet",
          description: "Voucher has been added to your Google Wallet!",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add voucher to Google Wallet.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Add to wallet error:', error);
      toast({
        title: "Error",
        description: "Failed to add voucher to Google Wallet.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading vouchers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      {/* Header with Points Display */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Google Wallet Rewards</h1>
          <p className="text-muted-foreground">Redeem your points for amazing vouchers</p>
        </div>
        <Card className="w-full sm:w-auto">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userPoints.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Available Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">Available Vouchers</TabsTrigger>
          <TabsTrigger value="redeemed">My Vouchers</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Button>
            {Object.entries(categoryIcons).map(([category, Icon]) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          {/* Available Vouchers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVouchers.map((voucher) => {
              const CategoryIcon = categoryIcons[voucher.category];
              const canAfford = userPoints >= voucher.pointsCost;
              
              return (
                <Card key={voucher.id} className={`relative ${!canAfford ? 'opacity-60' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                        <Badge variant={voucher.availability === 'available' ? 'default' : 'secondary'}>
                          {voucher.availability}
                        </Badge>
                      </div>
                      {voucher.popularityRank <= 3 && (
                        <Badge variant="destructive" className="gap-1">
                          <Star className="h-3 w-3" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{voucher.title}</CardTitle>
                    <CardDescription>{voucher.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">₹{voucher.value}</p>
                        <p className="text-sm text-muted-foreground">{voucher.pointsCost} points</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Expires in</p>
                        <p className="font-medium">{voucher.expiryDays} days</p>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => handleRedeemVoucher(voucher)}
                      disabled={!canAfford || voucher.availability === 'out_of_stock'}
                    >
                      {!canAfford ? 'Insufficient Points' : 
                       voucher.availability === 'out_of_stock' ? 'Out of Stock' : 
                       'Redeem Now'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="redeemed" className="space-y-4">
          {redeemedVouchers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Vouchers Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't redeemed any vouchers yet. Start earning points and redeem amazing rewards!
                </p>
                <Button onClick={() => setSelectedCategory('all')}>
                  Browse Vouchers
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {redeemedVouchers.map((redeemedVoucher) => {
                const StatusIcon = statusIcons[redeemedVoucher.status];
                const statusColor = statusColors[redeemedVoucher.status];
                
                return (
                  <Card key={redeemedVoucher.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{redeemedVoucher.voucher.title}</CardTitle>
                        <Badge variant={redeemedVoucher.status === 'active' ? 'default' : 'secondary'} className="gap-1">
                          <StatusIcon className={`h-3 w-3 ${statusColor}`} />
                          {redeemedVoucher.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        Redeemed on {new Date(redeemedVoucher.redeemedAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="font-mono text-center text-lg font-bold">
                          {redeemedVoucher.redemptionCode}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Expires: {new Date(redeemedVoucher.expiresAt).toLocaleDateString()}
                        </div>
                        <p className="font-medium">₹{redeemedVoucher.voucher.value}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 gap-2"
                          onClick={() => window.open(redeemedVoucher.qrCode, '_blank')}
                        >
                          <QrCode className="h-4 w-4" />
                          View QR
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 gap-2"
                          onClick={() => handleAddToWallet(redeemedVoucher)}
                        >
                          <Wallet className="h-4 w-4" />
                          Add to Wallet
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Redemption Confirmation Dialog */}
      <Dialog open={showRedemptionDialog} onOpenChange={setShowRedemptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem this voucher?
            </DialogDescription>
          </DialogHeader>
          {selectedVoucher && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{selectedVoucher.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedVoucher.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-lg font-bold">₹{selectedVoucher.value}</span>
                    <span className="text-lg font-bold text-primary">{selectedVoucher.pointsCost} points</span>
                  </div>
                </CardContent>
              </Card>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Terms & Conditions</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {selectedVoucher.termsAndConditions.slice(0, 2).map((term, index) => (
                      <li key={index}>{term}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowRedemptionDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={confirmRedemption} disabled={isRedeeming} className="flex-1">
                  {isRedeeming && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Confirm Redemption
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
