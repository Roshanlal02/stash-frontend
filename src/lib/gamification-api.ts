'use client';

// 🔧 MOCK MODE: All API calls are mocked for development/testing
// Remove this comment and restore real API calls for production

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
    console.log('🔧 MOCK: Awarding points for user:', userId, 'receipt:', receiptId);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      // Simulate occasional failures (5% chance)
      if (Math.random() < 0.05) {
        throw new GamificationAPIError(
          "Mock: Points service temporarily unavailable",
          "SERVICE_UNAVAILABLE",
          { retryAfter: 2000 }
        );
      }

      // Calculate mock points based on receipt characteristics
      const basePoints = Math.floor(Math.random() * 50) + 25; // 25-75 base points
      const bonusPoints = Math.random() > 0.7 ? Math.floor(Math.random() * 25) + 10 : 0; // 30% chance of bonus
      const totalPointsAwarded = basePoints + bonusPoints;

      // Simulate user's total points (progressive increase)
      const currentTime = Date.now();
      const daysSinceEpoch = Math.floor(currentTime / (1000 * 60 * 60 * 24));
      const simulatedTotalPoints = (daysSinceEpoch % 1000) * 47 + totalPointsAwarded; // Varying total

      const mockResponse: AwardPointsResponse = {
        status: bonusPoints > 0 ? 'success_with_bonus' : 'success',
        points: totalPointsAwarded,
        totalPoints: simulatedTotalPoints
      };

      console.log('🔧 MOCK: Points awarded successfully', { 
        pointsAwarded: totalPointsAwarded, 
        totalPoints: simulatedTotalPoints,
        hasBonus: bonusPoints > 0
      });

      return mockResponse;

    } catch (error) {
      // Handle network errors and other exceptions
      if (error instanceof GamificationAPIError) {
        throw error;
      }

      throw new GamificationAPIError(
        error instanceof Error ? error.message : 'Mock: Points awarding failed',
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
