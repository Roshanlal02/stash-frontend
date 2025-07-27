'use client';

// 🔧 MOCK MODE: Comprehensive mock data API for all screens
// This provides realistic data for dashboard, user progress, levels, receipts, and more

import { useAuth } from '@/hooks/use-auth';

// ===== INTERFACES =====

export interface UserProgress {
  level: number;
  xp: number;
  xpForNextLevel: number;
  scanStreak: number;
  budgetStreak: number;
  totalSpent: number;
  budgetRemaining: number;
  totalBudget: number;
}

export interface Level {
  id: number;
  name: string;
  goal: number;
  status: 'completed' | 'active' | 'locked';
  description?: string;
  reward?: string;
}

export interface Receipt {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  status: 'normal' | 'anomaly';
  items?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

export interface DashboardStats {
  totalSpending: number;
  budgetRemaining: number;
  currentLevel: number;
  scanStreak: number;
  spendingChange: string; // e.g., "+20.1% from last month"
  budgetProgress: number; // percentage
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  earnedDate?: string;
  isEarned: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'anomaly' | 'budget' | 'achievement' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

// ===== MOCK DATA GENERATORS =====

export class MockDataAPI {
  // Generate consistent user-specific data based on user ID
  private static getUserSeed(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private static seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Generate user progress data
  static getUserProgress(userId: string): UserProgress {
    const seed = this.getUserSeed(userId);
    const random = this.seededRandom(seed);
    
    const level = Math.floor(random * 8) + 3; // Level 3-10
    const xp = Math.floor(this.seededRandom(seed + 1) * 800) + 200; // 200-1000 XP
    const xpForNextLevel = level * 200; // Increasing XP requirements
    const scanStreak = Math.floor(this.seededRandom(seed + 2) * 15) + 1; // 1-15 days
    const budgetStreak = Math.floor(this.seededRandom(seed + 3) * 5) + 1; // 1-5 months
    const totalSpent = Math.floor(this.seededRandom(seed + 4) * 300000) + 50000; // ₹50k-₹350k
    const totalBudget = 400000; // ₹4 lakh budget
    const budgetRemaining = totalBudget - totalSpent;

    return {
      level,
      xp,
      xpForNextLevel,
      scanStreak,
      budgetStreak,
      totalSpent,
      budgetRemaining,
      totalBudget
    };
  }

  // Generate levels data
  static getLevels(): Level[] {
    return [
      { id: 1, name: "January Savings", goal: 8000, status: "completed", description: "Save ₹8,000 in January", reward: "Beginner Badge" },
      { id: 2, name: "February Frugality", goal: 12000, status: "completed", description: "Save ₹12,000 in February", reward: "Saver Badge" },
      { id: 3, name: "March Moolah", goal: 16000, status: "completed", description: "Save ₹16,000 in March", reward: "Thrifty Badge" },
      { id: 4, name: "April Accumulation", goal: 20000, status: "active", description: "Save ₹20,000 in April", reward: "Smart Spender Badge" },
      { id: 5, name: "May Money", goal: 25000, status: "locked", description: "Save ₹25,000 in May", reward: "Money Master Badge" },
      { id: 6, name: "June Journey", goal: 30000, status: "locked", description: "Save ₹30,000 in June", reward: "Financial Guru Badge" },
      { id: 7, name: "July Jackpot", goal: 35000, status: "locked", description: "Save ₹35,000 in July", reward: "Wealth Builder Badge" },
      { id: 8, name: "August Achievement", goal: 40000, status: "locked", description: "Save ₹40,000 in August", reward: "Champion Badge" }
    ];
  }

  // Generate recent receipts
  static getRecentReceipts(userId: string, count: number = 5): Receipt[] {
    const seed = this.getUserSeed(userId);
    const receipts: Receipt[] = [];

    const merchants = [
      { name: "Starbucks Coffee", category: "Food & Drink", baseAmount: 150 },
      { name: "Target", category: "Shopping", baseAmount: 2500 },
      { name: "Shell Gas Station", category: "Transportation", baseAmount: 1500 },
      { name: "Amazon Fresh", category: "Groceries", baseAmount: 3000 },
      { name: "McDonald's", category: "Food & Drink", baseAmount: 400 },
      { name: "Walmart", category: "Shopping", baseAmount: 2000 },
      { name: "Best Buy", category: "Electronics", baseAmount: 15000 },
      { name: "Local Grocery Store", category: "Groceries", baseAmount: 1200 },
      { name: "Uber", category: "Transportation", baseAmount: 300 },
      { name: "Zomato", category: "Food & Drink", baseAmount: 500 }
    ];

    for (let i = 0; i < count; i++) {
      const merchantIndex = Math.floor(this.seededRandom(seed + i) * merchants.length);
      const merchant = merchants[merchantIndex];
      const variance = this.seededRandom(seed + i + 10) * 0.6 + 0.7; // 0.7x to 1.3x
      const amount = Math.round(merchant.baseAmount * variance);
      const daysAgo = i + Math.floor(this.seededRandom(seed + i + 20) * 3);
      const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      
      // Determine if anomaly (high spending)
      const isAnomaly = amount > merchant.baseAmount * 1.5;

      receipts.push({
        id: `receipt_${Date.now()}_${i}`,
        merchant: merchant.name,
        amount: amount,
        date: date.toISOString().split('T')[0],
        category: merchant.category,
        status: isAnomaly ? 'anomaly' : 'normal'
      });
    }

    return receipts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Generate dashboard stats
  static getDashboardStats(userId: string): DashboardStats {
    const userProgress = this.getUserProgress(userId);
    const seed = this.getUserSeed(userId);
    
    const spendingChangePercent = (this.seededRandom(seed + 5) * 40) - 20; // -20% to +20%
    const spendingChangeText = spendingChangePercent >= 0 
      ? `+${spendingChangePercent.toFixed(1)}% from last month`
      : `${spendingChangePercent.toFixed(1)}% from last month`;

    return {
      totalSpending: userProgress.totalSpent,
      budgetRemaining: userProgress.budgetRemaining,
      currentLevel: userProgress.level,
      scanStreak: userProgress.scanStreak,
      spendingChange: spendingChangeText,
      budgetProgress: ((userProgress.totalBudget - userProgress.budgetRemaining) / userProgress.totalBudget) * 100
    };
  }

  // Generate badges data
  static getBadges(userId: string): Badge[] {
    const userProgress = this.getUserProgress(userId);
    const seed = this.getUserSeed(userId);

    const allBadges = [
      { id: 1, name: 'First Scan', description: 'Scanned your first receipt.', icon: 'Trophy' },
      { id: 2, name: 'Budget Master', description: 'Stayed within budget for a month.', icon: 'Shield' },
      { id: 3, name: 'Super Saver', description: 'Saved over ₹40,000 in a month.', icon: 'Star' },
      { id: 4, name: 'Anomaly Hunter', description: 'Detected 5 spending anomalies.', icon: 'Zap' },
      { id: 5, name: 'Monthly Streak', description: 'Used the app every day for a month.', icon: 'Trophy' },
      { id: 6, name: 'Smart Shopper', description: 'Compared prices before 10 purchases.', icon: 'ShoppingCart' },
      { id: 7, name: 'Receipt Master', description: 'Scanned 50 receipts.', icon: 'Receipt' },
      { id: 8, name: 'Level Up', description: 'Reached level 5 or higher.', icon: 'Crown' }
    ];

    return allBadges.map(badge => ({
      ...badge,
      isEarned: this.seededRandom(seed + badge.id) > 0.3, // 70% chance earned
      earnedDate: this.seededRandom(seed + badge.id) > 0.3 
        ? new Date(Date.now() - Math.floor(this.seededRandom(seed + badge.id + 10) * 30) * 24 * 60 * 60 * 1000).toISOString()
        : undefined
    }));
  }

  // Generate notifications
  static getNotifications(userId: string): NotificationItem[] {
    const seed = this.getUserSeed(userId);
    const notifications: NotificationItem[] = [];

    const notificationTemplates = [
      {
        type: 'anomaly' as const,
        title: 'Unusual Spending Detected',
        message: 'High spending of ₹15,000 at Electronics Store detected.',
        priority: 'high' as const
      },
      {
        type: 'budget' as const,
        title: 'Budget Alert',
        message: 'You\'ve used 80% of your monthly budget.',
        priority: 'medium' as const
      },
      {
        type: 'achievement' as const,
        title: 'New Badge Earned!',
        message: 'Congratulations! You earned the "Smart Shopper" badge.',
        priority: 'low' as const
      },
      {
        type: 'reminder' as const,
        title: 'Scan Reminder',
        message: 'Don\'t forget to scan your receipts today!',
        priority: 'low' as const
      }
    ];

    for (let i = 0; i < 6; i++) {
      const templateIndex = Math.floor(this.seededRandom(seed + i) * notificationTemplates.length);
      const template = notificationTemplates[templateIndex];
      const hoursAgo = Math.floor(this.seededRandom(seed + i + 10) * 72); // Up to 3 days ago
      
      notifications.push({
        id: `notification_${i}`,
        ...template,
        timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
        isRead: this.seededRandom(seed + i + 20) > 0.4 // 60% chance read
      });
    }

    return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Simulate API delay
  static async delay(min: number = 800, max: number = 2000): Promise<void> {
    const delay = min + Math.random() * (max - min);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// ===== REACT HOOKS =====

export function useMockDashboardData() {
  const { user } = useAuth();

  const fetchDashboardData = async () => {
    console.log('🔧 MOCK: Fetching dashboard data for user:', user?.uid);
    await MockDataAPI.delay();

    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    const userProgress = MockDataAPI.getUserProgress(user.uid);
    const dashboardStats = MockDataAPI.getDashboardStats(user.uid);
    const recentReceipts = MockDataAPI.getRecentReceipts(user.uid, 3);
    const levels = MockDataAPI.getLevels();

    console.log('🔧 MOCK: Dashboard data fetched successfully');

    return {
      userProgress,
      dashboardStats,
      recentReceipts,
      levels: levels.slice(0, 4) // Show first 4 levels
    };
  };

  return { fetchDashboardData };
}

export function useMockUserData() {
  const { user } = useAuth();

  const fetchUserProgress = async () => {
    console.log('🔧 MOCK: Fetching user progress for:', user?.uid);
    await MockDataAPI.delay(500, 1200);

    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    return MockDataAPI.getUserProgress(user.uid);
  };

  const fetchBadges = async () => {
    console.log('🔧 MOCK: Fetching badges for:', user?.uid);
    await MockDataAPI.delay(600, 1400);

    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    return MockDataAPI.getBadges(user.uid);
  };

  const fetchNotifications = async () => {
    console.log('🔧 MOCK: Fetching notifications for:', user?.uid);
    await MockDataAPI.delay(400, 1000);

    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    return MockDataAPI.getNotifications(user.uid);
  };

  return {
    fetchUserProgress,
    fetchBadges,
    fetchNotifications
  };
}

export function useMockReceiptsData() {
  const { user } = useAuth();

  const fetchAllReceipts = async (count: number = 20) => {
    console.log('🔧 MOCK: Fetching all receipts for:', user?.uid);
    await MockDataAPI.delay(1000, 2500);

    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    return MockDataAPI.getRecentReceipts(user.uid, count);
  };

  return { fetchAllReceipts };
}
