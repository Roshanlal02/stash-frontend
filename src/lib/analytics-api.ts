'use client';

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
    try {
      // Make API request to get spending report
      const response = await fetch(`https://stash-api-q7i2taqzba-uc.a.run.app/adk/analytics/spending-report/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if response is ok
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorCode = response.status.toString();
        let errorDetails = null;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          errorCode = errorData.code || errorCode;
          errorDetails = errorData.details || errorData;
        } catch (parseError) {
          // If we can't parse the error response, use the default message
        }

        // Handle specific HTTP status codes
        switch (response.status) {
          case 404:
            throw new AnalyticsAPIError(
              'No spending data found for this user',
              'NO_DATA_FOUND',
              errorDetails
            );
          case 403:
            throw new AnalyticsAPIError(
              'Access denied. Please check your permissions.',
              'ACCESS_DENIED',
              errorDetails
            );
          case 429:
            throw new AnalyticsAPIError(
              'Too many requests. Please try again later.',
              'RATE_LIMITED',
              errorDetails
            );
          case 500:
            throw new AnalyticsAPIError(
              'Server error occurred. Please try again later.',
              'SERVER_ERROR',
              errorDetails
            );
          default:
            throw new AnalyticsAPIError(errorMessage, errorCode, errorDetails);
        }
      }

      // Parse successful response
      const data: SpendingReportResponse = await response.json();
      
      // Validate required fields
      if (!data.report || typeof data.totalSpent !== 'number' || typeof data.receiptCount !== 'number') {
        throw new AnalyticsAPIError(
          'Invalid response format from server',
          'INVALID_RESPONSE',
          data
        );
      }

      return data;

    } catch (error) {
      // Handle network errors and other exceptions
      if (error instanceof AnalyticsAPIError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new AnalyticsAPIError(
          'Network error. Please check your connection and try again.',
          'NETWORK_ERROR',
          error
        );
      }

      throw new AnalyticsAPIError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
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
