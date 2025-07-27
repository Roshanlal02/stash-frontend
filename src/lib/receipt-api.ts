"use client";

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
  // Step 1: Upload file to get imageUrl
  async uploadFile(file: File, userId?: string): Promise<UploadResponse> {
    try {
      // Create FormData with multipart/form-data
      const formData = new FormData();
      formData.append('file', file); // Binary file
      formData.append('userId', userId || 'anonymous');

      const response = await fetch(
        "https://stash-api-q7i2taqzba-uc.a.run.app/adk/upload",
        {
          method: "POST",
          body: formData,
          // Don't set Content-Type header - browser will set it automatically with boundary for multipart/form-data
        }
      );

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

        throw new ReceiptAPIError(errorMessage, errorCode, errorDetails);
      }

      const uploadResult: UploadResponse = await response.json();
      return uploadResult;
    } catch (error) {
      if (error instanceof ReceiptAPIError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new ReceiptAPIError(
          "Network error during file upload. Please check your connection and try again.",
          "NETWORK_ERROR",
          error
        );
      }

      throw new ReceiptAPIError(
        error instanceof Error ? error.message : "File upload failed",
        "UPLOAD_ERROR",
        error
      );
    }
  },

  // Step 2: Process receipt using imageUrl
  async processReceipt(
    imageUrl: string,
    userId?: string
  ): Promise<ReceiptProcessResponse> {
    try {
      // Make API request to process receipt with imageUrl
      const response = await fetch(
        "https://stash-api-q7i2taqzba-uc.a.run.app/adk/receipts/process-receipt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl,
            userId: userId || "anonymous",
          }),
        }
      );

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

        throw new ReceiptAPIError(errorMessage, errorCode, errorDetails);
      }

      // Parse successful response
      const data: ReceiptProcessResponse = await response.json();

      if (!data.success) {
        throw new ReceiptAPIError(
          data.error || data.message || "Processing failed",
          "PROCESSING_FAILED",
          data
        );
      }

      return data;
    } catch (error) {
      // Handle network errors and other exceptions
      if (error instanceof ReceiptAPIError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new ReceiptAPIError(
          "Network error. Please check your connection and try again.",
          "NETWORK_ERROR",
          error
        );
      }

      throw new ReceiptAPIError(
        error instanceof Error ? error.message : "An unexpected error occurred",
        "UNKNOWN_ERROR",
        error
      );
    }
  },

  async uploadAndProcessReceipt(
    file: File,
    userId?: string
  ): Promise<ReceiptProcessResponse> {
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
