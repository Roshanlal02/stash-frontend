'use client';

// 🔧 MOCK MODE: User storage API mocked for development/testing
// This simulates local storage and user data persistence

export interface StoredUserData {
  receipts: any[];
  spending: {
    totalSpent: number;
    categories: Record<string, number>;
    monthlySpending: Record<string, number>;
  };
  gamification: {
    points: number;
    level: number;
    badges: string[];
    streak: number;
  };
  preferences: {
    budgetGoal: number;
    currency: string;
    notifications: boolean;
  };
}

export class UserStorage {
  private static getStorageKey(userId: string): string {
    return `stash_user_data_${userId}`;
  }

  // Get user data from localStorage (or create default)
  static getUserData(userId: string): StoredUserData {
    console.log('🔧 MOCK: Getting user data from storage for:', userId);
    
    try {
      const stored = localStorage.getItem(this.getStorageKey(userId));
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('🔧 MOCK: Failed to parse stored user data, using defaults');
    }

    // Return default data structure
    const defaultData: StoredUserData = {
      receipts: [],
      spending: {
        totalSpent: 0,
        categories: {},
        monthlySpending: {}
      },
      gamification: {
        points: 0,
        level: 1,
        badges: [],
        streak: 0
      },
      preferences: {
        budgetGoal: 400000, // ₹4 lakh default
        currency: 'INR',
        notifications: true
      }
    };

    // Save default data
    this.saveUserData(userId, defaultData);
    return defaultData;
  }

  // Save user data to localStorage
  static saveUserData(userId: string, data: StoredUserData): void {
    console.log('🔧 MOCK: Saving user data to storage for:', userId);
    
    try {
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(data));
    } catch (error) {
      console.error('🔧 MOCK: Failed to save user data:', error);
    }
  }

  // Add a receipt to user's data
  static addReceipt(userId: string, receiptData: any): void {
    console.log('🔧 MOCK: Adding receipt to user storage:', receiptData.merchant);
    
    const userData = this.getUserData(userId);
    userData.receipts.unshift(receiptData); // Add to beginning
    
    // Update spending totals
    userData.spending.totalSpent += receiptData.amount;
    
    // Update category spending
    const category = receiptData.category || 'Other';
    userData.spending.categories[category] = (userData.spending.categories[category] || 0) + receiptData.amount;
    
    // Update monthly spending
    const month = new Date(receiptData.date).toISOString().slice(0, 7); // YYYY-MM
    userData.spending.monthlySpending[month] = (userData.spending.monthlySpending[month] || 0) + receiptData.amount;
    
    // Keep only last 100 receipts to prevent storage bloat
    if (userData.receipts.length > 100) {
      userData.receipts = userData.receipts.slice(0, 100);
    }
    
    this.saveUserData(userId, userData);
  }

  // Update gamification data
  static updateGamification(userId: string, points: number, level?: number, badges?: string[]): void {
    console.log('🔧 MOCK: Updating gamification data:', { points, level, badges });
    
    const userData = this.getUserData(userId);
    userData.gamification.points += points;
    
    if (level !== undefined) {
      userData.gamification.level = level;
    }
    
    if (badges) {
      badges.forEach(badge => {
        if (!userData.gamification.badges.includes(badge)) {
          userData.gamification.badges.push(badge);
        }
      });
    }
    
    this.saveUserData(userId, userData);
  }

  // Update user preferences
  static updatePreferences(userId: string, preferences: Partial<StoredUserData['preferences']>): void {
    console.log('🔧 MOCK: Updating user preferences:', preferences);
    
    const userData = this.getUserData(userId);
    userData.preferences = { ...userData.preferences, ...preferences };
    
    this.saveUserData(userId, userData);
  }

  // Get spending summary
  static getSpendingSummary(userId: string): {
    totalSpent: number;
    categorySummary: Array<{ category: string; amount: number; percentage: number }>;
    monthlyTrend: Array<{ month: string; amount: number }>;
  } {
    console.log('🔧 MOCK: Getting spending summary for:', userId);
    
    const userData = this.getUserData(userId);
    const { totalSpent, categories, monthlySpending } = userData.spending;
    
    // Calculate category summary with percentages
    const categorySummary = Object.entries(categories)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
    
    // Get monthly trend (last 6 months)
    const monthlyTrend = Object.entries(monthlySpending)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months
    
    return {
      totalSpent,
      categorySummary,
      monthlyTrend
    };
  }

  // Clear all user data (for testing/reset)
  static clearUserData(userId: string): void {
    console.log('🔧 MOCK: Clearing user data for:', userId);
    localStorage.removeItem(this.getStorageKey(userId));
  }

  // Export user data (for backup/debugging)
  static exportUserData(userId: string): string {
    console.log('🔧 MOCK: Exporting user data for:', userId);
    const userData = this.getUserData(userId);
    return JSON.stringify(userData, null, 2);
  }

  // Import user data (for backup restore)
  static importUserData(userId: string, dataJson: string): boolean {
    console.log('🔧 MOCK: Importing user data for:', userId);
    
    try {
      const userData = JSON.parse(dataJson);
      // Basic validation
      if (userData && typeof userData === 'object' && userData.receipts && userData.spending) {
        this.saveUserData(userId, userData);
        return true;
      }
    } catch (error) {
      console.error('🔧 MOCK: Failed to import user data:', error);
    }
    
    return false;
  }
}

// React hook for using user storage
export function useUserStorage() {
  const addReceipt = (userId: string, receiptData: any) => {
    UserStorage.addReceipt(userId, receiptData);
  };

  const updateGamification = (userId: string, points: number, level?: number, badges?: string[]) => {
    UserStorage.updateGamification(userId, points, level, badges);
  };

  const updatePreferences = (userId: string, preferences: Partial<StoredUserData['preferences']>) => {
    UserStorage.updatePreferences(userId, preferences);
  };

  const getSpendingSummary = (userId: string) => {
    return UserStorage.getSpendingSummary(userId);
  };

  const getUserData = (userId: string) => {
    return UserStorage.getUserData(userId);
  };

  return {
    addReceipt,
    updateGamification,
    updatePreferences,
    getSpendingSummary,
    getUserData
  };
}
