'use client';

// 🔧 MOCK MODE: Google Wallet API mocked for development/testing
// Remove this comment and restore real Google Wallet API calls for production

import { useAuth } from '@/hooks/use-auth';

// ===== INTERFACES =====

export interface WalletVoucher {
  id: string;
  title: string;
  description: string;
  brand: string;
  value: number;
  pointsCost: number;
  category: 'food' | 'shopping' | 'transport' | 'entertainment' | 'fuel' | 'general';
  imageUrl: string;
  expiryDays: number;
  termsAndConditions: string[];
  availability: 'available' | 'limited' | 'out_of_stock';
  popularityRank: number;
}

export interface RedeemedVoucher {
  id: string;
  voucherId: string;
  voucher: WalletVoucher;
  redemptionCode: string;
  redeemedAt: string;
  expiresAt: string;
  status: 'active' | 'used' | 'expired';
  qrCode: string;
  walletPassId?: string;
}

export interface RedemptionRequest {
  voucherId: string;
  userId: string;
  pointsToSpend: number;
}

export interface RedemptionResponse {
  success: boolean;
  redeemedVoucher?: RedeemedVoucher;
  remainingPoints: number;
  message?: string;
  error?: string;
}

export interface WalletIntegrationStatus {
  isGoogleWalletAvailable: boolean;
  hasWalletPermission: boolean;
  walletAppVersion?: string;
  supportedVoucherTypes: string[];
}

export class GoogleWalletError extends Error {
  code?: string;
  details?: any;

  constructor(message: string, code?: string, details?: any) {
    super(message);
    this.name = 'GoogleWalletError';
    this.code = code;
    this.details = details;
  }
}

// ===== MOCK DATA =====

const MOCK_VOUCHERS: WalletVoucher[] = [
  {
    id: 'voucher_starbucks_500',
    title: '₹500 Starbucks Gift Card',
    description: 'Enjoy your favorite coffee and treats at any Starbucks location',
    brand: 'Starbucks',
    value: 500,
    pointsCost: 2500,
    category: 'food',
    imageUrl: 'https://via.placeholder.com/200x120/00704A/white?text=Starbucks',
    expiryDays: 365,
    termsAndConditions: [
      'Valid at all Starbucks locations in India',
      'Cannot be exchanged for cash',
      'Valid for 1 year from date of issue',
      'Single use only'
    ],
    availability: 'available',
    popularityRank: 1
  },
  {
    id: 'voucher_amazon_1000',
    title: '₹1000 Amazon Gift Card',
    description: 'Shop millions of products on Amazon with this gift card',
    brand: 'Amazon',
    value: 1000,
    pointsCost: 4500,
    category: 'shopping',
    imageUrl: 'https://via.placeholder.com/200x120/FF9900/white?text=Amazon',
    expiryDays: 730,
    termsAndConditions: [
      'Valid on Amazon.in only',
      'Cannot be used for Amazon Prime subscription',
      'Valid for 2 years from date of issue',
      'Cannot be transferred to another account'
    ],
    availability: 'available',
    popularityRank: 2
  },
  {
    id: 'voucher_uber_300',
    title: '₹300 Uber Ride Credit',
    description: 'Get ₹300 credit for your next Uber rides',
    brand: 'Uber',
    value: 300,
    pointsCost: 1400,
    category: 'transport',
    imageUrl: 'https://via.placeholder.com/200x120/000000/white?text=Uber',
    expiryDays: 90,
    termsAndConditions: [
      'Valid for Uber rides only, not Uber Eats',
      'Credit expires in 90 days',
      'Cannot be combined with other offers',
      'Valid in India only'
    ],
    availability: 'available',
    popularityRank: 3
  },
  {
    id: 'voucher_zomato_750',
    title: '₹750 Zomato Gift Card',
    description: 'Order your favorite food with this Zomato gift card',
    brand: 'Zomato',
    value: 750,
    pointsCost: 3500,
    category: 'food',
    imageUrl: 'https://via.placeholder.com/200x120/E23744/white?text=Zomato',
    expiryDays: 180,
    termsAndConditions: [
      'Valid on Zomato app and website',
      'Applicable on food orders only',
      'Valid for 6 months from date of issue',
      'Cannot be used for Zomato Pro membership'
    ],
    availability: 'available',
    popularityRank: 4
  },
  {
    id: 'voucher_bigbasket_600',
    title: '₹600 BigBasket Gift Card',
    description: 'Shop for groceries and essentials on BigBasket',
    brand: 'BigBasket',
    value: 600,
    pointsCost: 2800,
    category: 'shopping',
    imageUrl: 'https://via.placeholder.com/200x120/84C441/white?text=BigBasket',
    expiryDays: 365,
    termsAndConditions: [
      'Valid on BigBasket app and website',
      'Applicable on all products except gold coins',
      'Valid for 1 year from date of issue',
      'Minimum order value may apply'
    ],
    availability: 'limited',
    popularityRank: 5
  },
  {
    id: 'voucher_bookmyshow_400',
    title: '₹400 BookMyShow Voucher',
    description: 'Book movie tickets and events with this voucher',
    brand: 'BookMyShow',
    value: 400,
    pointsCost: 1900,
    category: 'entertainment',
    imageUrl: 'https://via.placeholder.com/200x120/C4242B/white?text=BookMyShow',
    expiryDays: 180,
    termsAndConditions: [
      'Valid for movie tickets and events',
      'Applicable on BookMyShow app and website',
      'Valid for 6 months from date of issue',
      'Cannot be used for convenience fees'
    ],
    availability: 'available',
    popularityRank: 6
  },
  {
    id: 'voucher_shell_500',
    title: '₹500 Shell Fuel Card',
    description: 'Fill up your tank at any Shell petrol pump',
    brand: 'Shell',
    value: 500,
    pointsCost: 2400,
    category: 'fuel',
    imageUrl: 'https://via.placeholder.com/200x120/FFDD00/black?text=Shell',
    expiryDays: 365,
    termsAndConditions: [
      'Valid at all Shell petrol pumps in India',
      'Cannot be exchanged for cash',
      'Valid for 1 year from date of issue',
      'Cannot be used for lubricants'
    ],
    availability: 'available',
    popularityRank: 7
  },
  {
    id: 'voucher_flipkart_800',
    title: '₹800 Flipkart Gift Card',
    description: 'Shop electronics, fashion, and more on Flipkart',
    brand: 'Flipkart',
    value: 800,
    pointsCost: 3700,
    category: 'shopping',
    imageUrl: 'https://via.placeholder.com/200x120/2874F0/white?text=Flipkart',
    expiryDays: 365,
    termsAndConditions: [
      'Valid on Flipkart app and website',
      'Cannot be used for gold coins or gift cards',
      'Valid for 1 year from date of issue',
      'Cannot be combined with other gift cards'
    ],
    availability: 'available',
    popularityRank: 8
  }
];

// ===== MOCK API =====

export const googleWalletAPI = {
  // Get available vouchers
  async getAvailableVouchers(category?: string): Promise<WalletVoucher[]> {
    console.log('🔧 MOCK: Fetching available vouchers', { category });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    
    // Simulate occasional failures (0.5% chance - reduced for better testing experience)
    if (Math.random() < 0.005) {
      throw new GoogleWalletError(
        "Mock: Voucher service temporarily unavailable",
        "SERVICE_UNAVAILABLE"
      );
    }

    let vouchers = [...MOCK_VOUCHERS];
    
    // Filter by category if provided
    if (category) {
      vouchers = vouchers.filter(v => v.category === category);
    }
    
    // Sort by popularity
    vouchers.sort((a, b) => a.popularityRank - b.popularityRank);
    
    console.log('🔧 MOCK: Vouchers fetched successfully', { count: vouchers.length });
    return vouchers;
  },

  // Redeem a voucher
  async redeemVoucher(request: RedemptionRequest): Promise<RedemptionResponse> {
    console.log('🔧 MOCK: Redeeming voucher', request);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2500));
    
    // Simulate occasional failures (1% chance - reduced for better testing experience)
    if (Math.random() < 0.01) {
      throw new GoogleWalletError(
        "Mock: Redemption service temporarily unavailable",
        "REDEMPTION_FAILED"
      );
    }

    // Find the voucher
    const voucher = MOCK_VOUCHERS.find(v => v.id === request.voucherId);
    if (!voucher) {
      return {
        success: false,
        remainingPoints: 5000, // Mock remaining points
        error: "Voucher not found"
      };
    }

    // Check if user has enough points
    if (request.pointsToSpend < voucher.pointsCost) {
      return {
        success: false,
        remainingPoints: request.pointsToSpend,
        error: "Insufficient points"
      };
    }

    // Check availability
    if (voucher.availability === 'out_of_stock') {
      return {
        success: false,
        remainingPoints: request.pointsToSpend,
        error: "Voucher is currently out of stock"
      };
    }

    // Generate redemption data
    const redemptionId = `redemption_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const redemptionCode = `${voucher.brand.toUpperCase()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const redeemedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + voucher.expiryDays * 24 * 60 * 60 * 1000).toISOString();
    const qrCode = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(redemptionCode)}`;
    
    const redeemedVoucher: RedeemedVoucher = {
      id: redemptionId,
      voucherId: voucher.id,
      voucher: voucher,
      redemptionCode: redemptionCode,
      redeemedAt: redeemedAt,
      expiresAt: expiresAt,
      status: 'active',
      qrCode: qrCode,
      walletPassId: `wallet_pass_${redemptionId}`
    };

    const remainingPoints = request.pointsToSpend - voucher.pointsCost;

    console.log('🔧 MOCK: Voucher redeemed successfully', { 
      voucher: voucher.title, 
      code: redemptionCode,
      remainingPoints 
    });

    return {
      success: true,
      redeemedVoucher: redeemedVoucher,
      remainingPoints: remainingPoints,
      message: "Voucher redeemed successfully and added to your Google Wallet!"
    };
  },

  // Get user's redeemed vouchers
  async getUserVouchers(userId: string): Promise<RedeemedVoucher[]> {
    console.log('🔧 MOCK: Fetching user vouchers for:', userId);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 1000));
    
    // Generate some mock redeemed vouchers based on user ID
    const userSeed = this.getUserSeed(userId);
    const mockRedeemedVouchers: RedeemedVoucher[] = [];
    
    for (let i = 0; i < 3; i++) {
      const voucherIndex = Math.floor(this.seededRandom(userSeed + i) * MOCK_VOUCHERS.length);
      const voucher = MOCK_VOUCHERS[voucherIndex];
      const daysAgo = Math.floor(this.seededRandom(userSeed + i + 10) * 30); // Up to 30 days ago
      const redeemedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      const expiresAt = new Date(redeemedAt.getTime() + voucher.expiryDays * 24 * 60 * 60 * 1000);
      
      // Determine status based on dates
      let status: 'active' | 'used' | 'expired' = 'active';
      if (expiresAt < new Date()) {
        status = 'expired';
      } else if (this.seededRandom(userSeed + i + 20) > 0.7) {
        status = 'used';
      }
      
      const redemptionCode = `${voucher.brand.toUpperCase()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      
      mockRedeemedVouchers.push({
        id: `redemption_${userSeed}_${i}`,
        voucherId: voucher.id,
        voucher: voucher,
        redemptionCode: redemptionCode,
        redeemedAt: redeemedAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        status: status,
        qrCode: `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(redemptionCode)}`,
        walletPassId: `wallet_pass_redemption_${userSeed}_${i}`
      });
    }
    
    console.log('🔧 MOCK: User vouchers fetched', { count: mockRedeemedVouchers.length });
    return mockRedeemedVouchers.sort((a, b) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime());
  },

  // Add voucher to Google Wallet
  async addToGoogleWallet(redeemedVoucher: RedeemedVoucher): Promise<{ success: boolean; walletUrl?: string; error?: string }> {
    console.log('🔧 MOCK: Adding voucher to Google Wallet', redeemedVoucher.voucher.title);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    
    // Simulate occasional failures (0.5% chance - reduced for better testing experience)
    if (Math.random() < 0.005) {
      return {
        success: false,
        error: "Failed to add voucher to Google Wallet. Please try again."
      };
    }

    // Generate mock Google Wallet URL
    const walletUrl = `https://pay.google.com/gp/v/save/${redeemedVoucher.walletPassId}`;
    
    console.log('🔧 MOCK: Voucher added to Google Wallet successfully');
    
    return {
      success: true,
      walletUrl: walletUrl
    };
  },

  // Check Google Wallet integration status
  async checkWalletIntegration(): Promise<WalletIntegrationStatus> {
    console.log('🔧 MOCK: Checking Google Wallet integration');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
    
    return {
      isGoogleWalletAvailable: true,
      hasWalletPermission: true,
      walletAppVersion: "2.0.0",
      supportedVoucherTypes: ['gift_card', 'loyalty_card', 'offer', 'transit']
    };
  },

  // Helper methods for consistent user-based data
  getUserSeed(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  },

  seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
};

// ===== REACT HOOKS =====

export function useGoogleWallet() {
  const { user } = useAuth();

  const getAvailableVouchers = async (category?: string) => {
    return googleWalletAPI.getAvailableVouchers(category);
  };

  const redeemVoucher = async (voucherId: string, pointsToSpend: number) => {
    if (!user?.uid) {
      throw new GoogleWalletError('User not authenticated', 'NOT_AUTHENTICATED');
    }
    
    return googleWalletAPI.redeemVoucher({
      voucherId,
      userId: user.uid,
      pointsToSpend
    });
  };

  const getUserVouchers = async () => {
    if (!user?.uid) {
      throw new GoogleWalletError('User not authenticated', 'NOT_AUTHENTICATED');
    }
    
    return googleWalletAPI.getUserVouchers(user.uid);
  };

  const addToGoogleWallet = async (redeemedVoucher: RedeemedVoucher) => {
    return googleWalletAPI.addToGoogleWallet(redeemedVoucher);
  };

  const checkWalletIntegration = async () => {
    return googleWalletAPI.checkWalletIntegration();
  };

  return {
    getAvailableVouchers,
    redeemVoucher,
    getUserVouchers,
    addToGoogleWallet,
    checkWalletIntegration
  };
}
