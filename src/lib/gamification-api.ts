'use client';

import { useAuth } from '@/hooks/use-auth';

interface AwardPointsRequest {
  userId: string;
  receiptId: string;
}

interface AwardPointsResponse {
  status: string;
  points: number;
  totalPoints: number;
}

interface GamificationError {
  message: string;
  code?: string;
  details?: any;
}

export class GamificationAPIError extends Error {
  code?: string;
  details?: any;

  constructor(message: string, code?: string, details?: any) {
    super(message);
    this.name = 'GamificationAPIError';
    this.code = code;
    this.details = details;
  }
}

export const gamificationAPI = {
  async awardPoints(userId: string, receiptId: string): Promise<AwardPointsResponse> {
    try {
      // Make API request to award points
      const response = await fetch('https://stash-api-q7i2taqzba-uc.a.run.app/adk/game/award-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          receiptId
        }),
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
          case 400:
            throw new GamificationAPIError(
              'Invalid request. Please check receipt ID and try again.',
              'INVALID_REQUEST',
              errorDetails
            );
          case 404:
            throw new GamificationAPIError(
              'Receipt not found or already processed.',
              'RECEIPT_NOT_FOUND',
              errorDetails
            );
          case 409:
            throw new GamificationAPIError(
              'Points already awarded for this receipt.',
              'POINTS_ALREADY_AWARDED',
              errorDetails
            );
          case 429:
            throw new GamificationAPIError(
              'Too many requests. Please try again later.',
              'RATE_LIMITED',
              errorDetails
            );
          case 500:
            throw new GamificationAPIError(
              'Server error occurred. Please try again later.',
              'SERVER_ERROR',
              errorDetails
            );
          default:
            throw new GamificationAPIError(errorMessage, errorCode, errorDetails);
        }
      }

      // Parse successful response
      const data: AwardPointsResponse = await response.json();
      
      // Validate required fields
      if (!data.status || typeof data.points !== 'number' || typeof data.totalPoints !== 'number') {
        throw new GamificationAPIError(
          'Invalid response format from server',
          'INVALID_RESPONSE',
          data
        );
      }

      return data;

    } catch (error) {
      // Handle network errors and other exceptions
      if (error instanceof GamificationAPIError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new GamificationAPIError(
          'Network error. Please check your connection and try again.',
          'NETWORK_ERROR',
          error
        );
      }

      throw new GamificationAPIError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        'UNKNOWN_ERROR',
        error
      );
    }
  }
};

// Hook for using gamification API with auth context
export function useGamificationAPI() {
  const { user } = useAuth();

  const awardPoints = async (receiptId: string) => {
    if (!user?.uid) {
      throw new GamificationAPIError(
        'User not authenticated',
        'NOT_AUTHENTICATED'
      );
    }
    return gamificationAPI.awardPoints(user.uid, receiptId);
  };

  return {
    awardPoints
  };
}

// Hook for awarding points with loading and error states
export function useAwardPoints() {
  const { awardPoints } = useGamificationAPI();
  
  const awardPointsForReceipt = async (receiptId: string) => {
    try {
      const result = await awardPoints(receiptId);
      return {
        data: result,
        error: null,
        success: true
      };
    } catch (error) {
      let errorMessage = 'Failed to award points';
      let errorCode = 'UNKNOWN_ERROR';

      if (error instanceof GamificationAPIError) {
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
    awardPointsForReceipt
  };
}
