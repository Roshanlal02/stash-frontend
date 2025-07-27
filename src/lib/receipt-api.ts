"use client";

// 🔧 MOCK MODE: All API calls are mocked for development/testing
// Remove this comment and restore real API calls for production

import { useAuth } from "@/hooks/use-auth";

interface UploadResponse {
  imageUrl: string;
  userId: string;
}

interface ReceiptProcessResponse {
  success: boolean;
  data?: {
    id: string;
    merchant: string;
    amount: number;
    date: string;
    category: string;
    items?: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
  };
  message?: string;
  error?: string;
}

interface ReceiptUploadError {
  message: string;
  code?: string;
  details?: any;
}

export class ReceiptAPIError extends Error {
  code?: string;
  details?: any;

  constructor(message: string, code?: string, details?: any) {
    super(message);
    this.name = "ReceiptAPIError";
    this.code = code;
    this.details = details;
  }
}

export const receiptAPI = {
  // Step 1: Upload file to get imageUrl (MOCKED)
  async uploadFile(file: File, userId?: string): Promise<UploadResponse> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Simulate occasional failures (1% chance - reduced for better testing experience)
      if (Math.random() < 0.01) {
        throw new ReceiptAPIError(
          "Mock: Upload service temporarily unavailable",
          "SERVICE_UNAVAILABLE",
          { retryAfter: 5000 }
        );
      }

      // Validate file type (simulate server validation)
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new ReceiptAPIError(
          "Invalid file type. Please upload a JPEG, PNG, or WebP image.",
          "INVALID_FILE_TYPE",
          { acceptedTypes: validTypes }
        );
      }

      // Validate file size (simulate 10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new ReceiptAPIError(
          "File too large. Maximum size is 10MB.",
          "FILE_TOO_LARGE",
          { maxSize, currentSize: file.size }
        );
      }

      // Mock successful upload response
      const mockImageUrl = `https://mock-storage.example.com/uploads/${Date.now()}-${file.name}`;
      const uploadResult: UploadResponse = {
        imageUrl: mockImageUrl,
        userId: userId || 'anonymous'
      };

      console.log('🔧 MOCK: File uploaded successfully', { file: file.name, imageUrl: mockImageUrl });
      return uploadResult;
    } catch (error) {
      if (error instanceof ReceiptAPIError) {
        throw error;
      }

      throw new ReceiptAPIError(
        error instanceof Error ? error.message : "Mock: File upload failed",
        "UPLOAD_ERROR",
        error
      );
    }
  },

  // Step 2: Process receipt using imageUrl (MOCKED)
  async processReceipt(
    imageUrl: string,
    userId?: string
  ): Promise<ReceiptProcessResponse> {
    try {
      // Simulate network delay for processing
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      
      // Simulate occasional failures (2% chance - reduced for better testing experience)
      if (Math.random() < 0.02) {
        throw new ReceiptAPIError(
          "Mock: Receipt processing failed - could not extract text from image",
          "PROCESSING_FAILED",
          { imageUrl }
        );
      }

      // Mock different receipt scenarios
      const mockReceipts = [
        {
          id: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          merchant: "Starbucks Coffee",
          amount: 15.47,
          date: new Date().toISOString().split('T')[0],
          category: "Food & Drink",
          items: [
            { name: "Grande Latte", price: 5.25, quantity: 1 },
            { name: "Blueberry Muffin", price: 3.95, quantity: 1 },
            { name: "Breakfast Sandwich", price: 6.27, quantity: 1 }
          ]
        },
        {
          id: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          merchant: "Target",
          amount: 87.23,
          date: new Date().toISOString().split('T')[0],
          category: "Shopping",
          items: [
            { name: "Toilet Paper 12-pack", price: 24.99, quantity: 1 },
            { name: "Laundry Detergent", price: 15.49, quantity: 1 },
            { name: "Snacks Variety Pack", price: 12.99, quantity: 2 },
            { name: "Cleaning Supplies", price: 20.77, quantity: 1 }
          ]
        },
        {
          id: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          merchant: "Shell Gas Station",
          amount: 42.15,
          date: new Date().toISOString().split('T')[0],
          category: "Transportation",
          items: [
            { name: "Regular Gasoline", price: 42.15, quantity: 1 }
          ]
        },
        {
          id: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          merchant: "Amazon Fresh",
          amount: 156.78,
          date: new Date().toISOString().split('T')[0],
          category: "Groceries",
          items: [
            { name: "Organic Bananas", price: 4.99, quantity: 1 },
            { name: "Chicken Breast", price: 28.45, quantity: 1 },
            { name: "Greek Yogurt", price: 12.99, quantity: 2 },
            { name: "Fresh Vegetables", price: 23.67, quantity: 1 },
            { name: "Pasta & Sauce", price: 18.34, quantity: 1 },
            { name: "Frozen Items", price: 34.89, quantity: 1 },
            { name: "Household Items", price: 33.45, quantity: 1 }
          ]
        }
      ];

      // Randomly select a mock receipt
      const mockReceipt = mockReceipts[Math.floor(Math.random() * mockReceipts.length)];
      
      const data: ReceiptProcessResponse = {
        success: true,
        data: mockReceipt,
        message: "Receipt processed successfully"
      };

      console.log('🔧 MOCK: Receipt processed successfully', { 
        imageUrl, 
        merchant: mockReceipt.merchant, 
        amount: mockReceipt.amount 
      });
      
      return data;
    } catch (error) {
      // Handle network errors and other exceptions
      if (error instanceof ReceiptAPIError) {
        throw error;
      }

      throw new ReceiptAPIError(
        error instanceof Error ? error.message : "Mock: An unexpected error occurred during processing",
        "UNKNOWN_ERROR",
        error
      );
    }
  },

  async uploadAndProcessReceipt(
    file: File,
    userId?: string
  ): Promise<ReceiptProcessResponse> {
    console.log('🔧 MOCK: Starting upload and process workflow for file:', file.name);
    
    // Step 1: Upload file to get imageUrl
    const uploadResult = await this.uploadFile(file, userId);

    // Step 2: Process receipt with imageUrl
    return await this.processReceipt(uploadResult.imageUrl, userId);
  },
};

// Hook for using receipt API with auth context
export function useReceiptAPI() {
  const { user } = useAuth();

  const uploadAndProcessReceipt = async (file: File) => {
    return receiptAPI.uploadAndProcessReceipt(file, user?.uid);
  };

  const processReceiptFromUrl = async (imageUrl: string) => {
    return receiptAPI.processReceipt(imageUrl, user?.uid);
  };

  const uploadFile = async (file: File) => {
    return receiptAPI.uploadFile(file, user?.uid);
  };

  return {
    uploadAndProcessReceipt,
    processReceiptFromUrl,
    uploadFile,
  };
}
