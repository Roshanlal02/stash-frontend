'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  QrCode, 
  Wallet, 
  Gift, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function GoogleWalletGuide() {
  const features = [
    {
      icon: Sparkles,
      title: 'Earn Points',
      description: 'Get points for every receipt you scan and every financial goal you achieve.',
      color: 'text-blue-600'
    },
    {
      icon: Gift,
      title: 'Choose Rewards',
      description: 'Browse vouchers from popular brands like Starbucks, Amazon, Uber, and more.',
      color: 'text-green-600'
    },
    {
      icon: Wallet,
      title: 'Add to Google Wallet',
      description: 'Instantly add redeemed vouchers to your Google Wallet for easy access.',
      color: 'text-purple-600'
    },
    {
      icon: QrCode,
      title: 'Use Anywhere',
      description: 'Show your QR code at participating stores or use online with redemption codes.',
      color: 'text-orange-600'
    }
  ];

  const supportedBrands = [
    { name: 'Starbucks', category: 'Food & Drink' },
    { name: 'Amazon', category: 'Shopping' },
    { name: 'Uber', category: 'Transport' },
    { name: 'Zomato', category: 'Food Delivery' },
    { name: 'BigBasket', category: 'Groceries' },
    { name: 'BookMyShow', category: 'Entertainment' },
    { name: 'Shell', category: 'Fuel' },
    { name: 'Flipkart', category: 'Shopping' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">How Google Wallet Rewards Work</h2>
        <p className="text-muted-foreground">
          Turn your smart spending habits into real rewards with Google Wallet integration
        </p>
      </div>

      {/* How it Works */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <Card key={feature.title} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-muted ${feature.color}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <Badge variant="outline">{index + 1}</Badge>
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
            {index < features.length - 1 && (
              <ArrowRight className="hidden lg:block absolute -right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            )}
          </Card>
        ))}
      </div>

      {/* Supported Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Supported Brands
          </CardTitle>
          <CardDescription>
            Redeem your points for vouchers from these popular brands
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {supportedBrands.map((brand) => (
              <div key={brand.name} className="text-center p-3 border rounded-lg">
                <h4 className="font-medium">{brand.name}</h4>
                <p className="text-xs text-muted-foreground">{brand.category}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Instant voucher delivery to Google Wallet
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Secure QR codes for in-store redemption
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                No expiry on earned points
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Real-time balance updates
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
              Google Wallet Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                Offline access to voucher codes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                Automatic expiry notifications
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                Quick access from lock screen
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                Synced across all your devices
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Important Notes */}
      <Alert>
        <Wallet className="h-4 w-4" />
        <AlertDescription>
          <strong>Getting Started:</strong> Make sure you have the Google Wallet app installed on your device. 
          Vouchers will be automatically added to your wallet when redeemed, and you'll receive a notification 
          with instructions on how to use them.
        </AlertDescription>
      </Alert>
    </div>
  );
}
