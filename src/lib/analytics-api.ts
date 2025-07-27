'use client';

// 🔧 MOCK MODE: All API calls are mocked for development/testing
// Remove this comment and restore real API calls for production

import { useAuth } from '@/hooks/use-auth';

interface SpendingReportResponse {
  report: string;
  receipts: Array<{
    receiptId: string;
    merchant: string;
    total: string;
    timestamp: string;
  }>;
  totalSpent: number;
  receiptCount: number;
}

interface AnalyticsError {
  message: string;
  code?: string;
  details?: any;
}

export class AnalyticsAPIError extends Error {
  code?: string;
  details?: any;

  constructor(message: string, code?: string, details?: any) {
    super(message);
    this.name = 'AnalyticsAPIError';
    this.code = code;
    this.details = details;
  }
}

export const analyticsAPI = {
  async getSpendingReport(userId: string): Promise<SpendingReportResponse> {
    console.log('🔧 MOCK: Fetching spending report for user:', userId);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
      
      // Simulate occasional failures (8% chance)
      if (Math.random() < 0.08) {
        throw new AnalyticsAPIError(
          "Mock: Analytics service temporarily unavailable",
          "SERVICE_UNAVAILABLE",
          { retryAfter: 3000 }
        );
      }

      // Generate mock spending data
      const mockReceipts = [
        {
          receiptId: `receipt_${Date.now()}_1`,
          merchant: "Starbucks Coffee",
          total: "15.47",
          timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          receiptId: `receipt_${Date.now()}_2`,
          merchant: "Target",
          total: "87.23",
          timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        },
        {
          receiptId: `receipt_${Date.now()}_3`,
          merchant: "Shell Gas Station",
          total: "42.15",
          timestamp: new Date(Date.now() - 259200000).toISOString() // 3 days ago
        },
        {
          receiptId: `receipt_${Date.now()}_4`,
          merchant: "Amazon Fresh",
          total: "156.78",
          timestamp: new Date(Date.now() - 345600000).toISOString() // 4 days ago
        },
        {
          receiptId: `receipt_${Date.now()}_5`,
          merchant: "McDonald's",
          total: "24.99",
          timestamp: new Date(Date.now() - 432000000).toISOString() // 5 days ago
        },
        {
          receiptId: `receipt_${Date.now()}_6`,
          merchant: "Walmart",
          total: "234.56",
          timestamp: new Date(Date.now() - 518400000).toISOString() // 6 days ago
        },
        {
          receiptId: `receipt_${Date.now()}_7`,
          merchant: "Best Buy",
          total: "399.99",
          timestamp: new Date(Date.now() - 604800000).toISOString() // 7 days ago
        }
      ];

      const totalSpent = mockReceipts.reduce((sum, receipt) => sum + parseFloat(receipt.total), 0);

      // Generate AI insights based on spending patterns
      const mockInsights = [
        "Based on your recent spending patterns, you've been quite consistent with your grocery shopping at Target and Amazon Fresh. Consider consolidating trips to save on gas.",
        "Your coffee spending at Starbucks has increased by 15% this month. Consider making coffee at home to save approximately ₹2,500 monthly.",
        "Great job on your transportation expenses! Your gas spending is 20% below average for users in your area.",
        "Your electronics purchase at Best Buy represents a significant one-time expense. Consider setting aside funds monthly for future tech upgrades.",
        "Your dining expenses show a healthy balance between convenience and cost. You're spending 12% less than the average user in your income bracket."
      ];

      const randomInsight = mockInsights[Math.floor(Math.random() * mockInsights.length)];

      const mockResponse: SpendingReportResponse = {
        report: randomInsight,
        receipts: mockReceipts.slice(0, 5), // Return latest 5 receipts
        totalSpent: totalSpent,
        receiptCount: mockReceipts.length
      };

      console.log('🔧 MOCK: Spending report generated successfully', { 
        totalSpent: mockResponse.totalSpent, 
        receiptCount: mockResponse.receiptCount 
      });

      return mockResponse;

    } catch (error) {
      // Handle network errors and other exceptions
      if (error instanceof AnalyticsAPIError) {
        throw error;
      }

      throw new AnalyticsAPIError(
        error instanceof Error ? error.message : 'Mock: An unexpected error occurred',
        'UNKNOWN_ERROR',
        error
      );
    }
  }
};

// Hook for using analytics API with auth context
export function useAnalyticsAPI() {
  const { user } = useAuth();

  const getSpendingReport = async () => {
    if (!user?.uid) {
      throw new AnalyticsAPIError(
        'User not authenticated',
        'NOT_AUTHENTICATED'
      );
    }
    return analyticsAPI.getSpendingReport(user.uid);
  };

  return {
    getSpendingReport
  };
}

// Hook for spending report with loading and error states
export function useSpendingReport() {
  const { getSpendingReport } = useAnalyticsAPI();
  
  const fetchSpendingReport = async () => {
    try {
      const report = await getSpendingReport();
      return {
        data: report,
        error: null,
        success: true
      };
    } catch (error) {
      let errorMessage = 'Failed to load spending report';
      let errorCode = 'UNKNOWN_ERROR';

      if (error instanceof AnalyticsAPIError) {
        errorMessage = error.message;
        errorCode = error.code || 'UNKNOWN_ERROR';
      }

      return {
        data: null,
        error: { message: errorMessage, code: errorCode },
        success: false
      };
    }
  };

  return {
    fetchSpendingReport
  };
}
