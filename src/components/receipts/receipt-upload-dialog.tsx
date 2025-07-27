'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { detectExpenseAnomaly } from '@/ai/flows/expense-anomaly-detection';
import { Loader2, Upload, Camera, AlertCircle, X, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CameraDialog } from './camera-dialog';
import { useReceiptAPI, ReceiptAPIError } from '@/lib/receipt-api';
import { useAwardPoints, GamificationAPIError } from '@/lib/gamification-api';

interface ReceiptUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReceiptUploadDialog({ open, onOpenChange }: ReceiptUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'processing' | 'analyzing' | 'complete' | 'error'>('idle');
  const [anomalyResult, setAnomalyResult] = useState<{ anomalyDetected: boolean; explanation: string } | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'camera' | null>(null);
  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [pointsAwarded, setPointsAwarded] = useState<{points: number, totalPoints: number} | null>(null);
  const { toast } = useToast();
  const { uploadAndProcessReceipt } = useReceiptAPI();
  const { awardPointsForReceipt } = useAwardPoints();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setUploadMethod('upload');
      setAnomalyResult(null);
      setUploadError(null);
      setUploadProgress('idle');
      setReceiptData(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    setCameraDialogOpen(true);
  };

  const handleCameraCapture = (capturedFile: File) => {
    setFile(capturedFile);
    setUploadMethod('camera');
    setAnomalyResult(null);
    setUploadError(null);
    setUploadProgress('idle');
    setReceiptData(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({ 
        title: 'No file selected', 
        description: 'Please select a receipt file to upload.', 
        variant: 'destructive' 
      });
      return;
    }

    setIsLoading(true);
    setUploadProgress('uploading');
    setAnomalyResult(null);
    setUploadError(null);

    try {
      // Step 1: Upload and process receipt with API
      setUploadProgress('processing');
      const uploadResult = await uploadAndProcessReceipt(file);
      
      if (uploadResult.success && uploadResult.data) {
        setReceiptData(uploadResult.data);
        setUploadProgress('analyzing');
        
        // Step 2: Award points for successful receipt upload
        try {
          const pointsResult = await awardPointsForReceipt(uploadResult.data.id);
          if (pointsResult.success && pointsResult.data) {
            setPointsAwarded({
              points: pointsResult.data.points,
              totalPoints: pointsResult.data.totalPoints
            });
          }
        } catch (pointsError) {
          console.warn('Points awarding failed:', pointsError);
          // Continue even if points awarding fails
        }
        
        // Step 3: Run anomaly detection with real data
        const receiptInfo = `Merchant: ${uploadResult.data.merchant}, Date: ${uploadResult.data.date}, Amount: ${uploadResult.data.amount}, Category: ${uploadResult.data.category}`;
        const spendingPatterns = `Average ${uploadResult.data.category?.toLowerCase()} expense analysis needed.`;

        try {
          const anomalyResult = await detectExpenseAnomaly({ 
            receiptData: receiptInfo, 
            spendingPatterns 
          });
          
          setAnomalyResult(anomalyResult);
          setUploadProgress('complete');

          // Enhanced success messages with points info
          const pointsMessage = pointsAwarded ? ` +${pointsAwarded.points} points earned!` : '';
          
          if (anomalyResult.anomalyDetected) {
            toast({
              title: 'Receipt Processed - Anomaly Detected!',
              description: `${uploadResult.data.merchant}: $${uploadResult.data.amount}. ${anomalyResult.explanation}${pointsMessage}`,
              variant: 'destructive',
              duration: 8000,
            });
          } else {
            toast({
              title: 'Receipt Processed Successfully',
              description: `${uploadResult.data.merchant}: $${uploadResult.data.amount} - No anomalies detected.${pointsMessage}`,
              duration: 5000,
            });
          }
        } catch (anomalyError) {
          // If anomaly detection fails, still show successful upload
          console.warn('Anomaly detection failed:', anomalyError);
          setUploadProgress('complete');
          const pointsMessage = pointsAwarded ? ` +${pointsAwarded.points} points earned!` : '';
          toast({
            title: 'Receipt Uploaded Successfully',
            description: `${uploadResult.data.merchant}: $${uploadResult.data.amount} - Processed successfully.${pointsMessage}`,
            duration: 5000,
          });
        }
      } else {
        throw new Error(uploadResult.message || 'Processing failed');
      }

    } catch (error) {
      console.error('Receipt upload error:', error);
      setUploadProgress('error');
      
      let errorMessage = 'Failed to process receipt. Please try again.';
      let errorTitle = 'Processing Error';

      if (error instanceof ReceiptAPIError) {
        errorMessage = error.message;
        
        switch (error.code) {
          case 'NETWORK_ERROR':
            errorTitle = 'Network Error';
            errorMessage = 'Please check your internet connection and try again.';
            break;
          case 'STORAGE_ERROR':
            errorTitle = 'Upload Error';
            errorMessage = 'Failed to upload image. Please try again.';
            break;
          case 'PROCESSING_FAILED':
            errorTitle = 'Processing Error';
            errorMessage = 'Could not read receipt data. Please ensure the image is clear and try again.';
            break;
          case '400':
            errorTitle = 'Invalid Request';
            errorMessage = 'Please select a valid receipt image.';
            break;
          case '500':
            errorTitle = 'Server Error';
            errorMessage = 'Server error occurred. Please try again later.';
            break;
        }
      }

      setUploadError(errorMessage);
      toast({ 
        title: errorTitle, 
        description: errorMessage, 
        variant: 'destructive',
        duration: 8000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetDialog = () => {
    setFile(null);
    setAnomalyResult(null);
    setUploadMethod(null);
    setIsLoading(false);
    setUploadProgress('idle');
    setUploadError(null);
    setReceiptData(null);
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Receipt</DialogTitle>
          <DialogDescription>
            Choose how you'd like to add your receipt - upload an existing image or take a photo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!file && (
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="flex flex-col h-24 space-y-2"
                onClick={handleUploadClick}
              >
                <Upload className="h-6 w-6" />
                <span className="text-sm">Upload File</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col h-24 space-y-2"
                onClick={handleCameraClick}
              >
                <Camera className="h-6 w-6" />
                <span className="text-sm">Take Photo</span>
              </Button>
            </div>
          )}

          {/* Hidden file input */}
          <Input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />

          {file && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  {uploadMethod === 'camera' ? (
                    <Camera className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  {uploadProgress === 'complete' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {uploadProgress === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetDialog}
                  className="h-8 w-8 p-0"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress indicator */}
              {isLoading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    {uploadProgress === 'uploading' && (
                      <>
                        <Wifi className="h-4 w-4 animate-pulse" />
                        <span>Uploading image...</span>
                      </>
                    )}
                    {uploadProgress === 'processing' && (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing receipt...</span>
                      </>
                    )}
                    {uploadProgress === 'analyzing' && (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Analyzing spending patterns...</span>
                      </>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: uploadProgress === 'uploading' ? '25%' : 
                               uploadProgress === 'processing' ? '60%' : 
                               uploadProgress === 'analyzing' ? '90%' : '0%' 
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Receipt data preview */}
              {receiptData && uploadProgress === 'complete' && (
                <div className="p-3 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-700">Receipt Processed</span>
                  </div>
                  <div className="text-xs text-green-600 space-y-1">
                    <div><strong>Merchant:</strong> {receiptData.merchant}</div>
                    <div><strong>Amount:</strong> ${receiptData.amount}</div>
                    <div><strong>Date:</strong> {receiptData.date}</div>
                    <div><strong>Category:</strong> {receiptData.category}</div>
                  </div>
                </div>
              )}

              {/* Error display */}
              {uploadError && uploadProgress === 'error' && (
                <Alert variant="destructive">
                  <WifiOff className="h-4 w-4" />
                  <AlertTitle>Processing Failed</AlertTitle>
                  <AlertDescription className="text-xs">
                    {uploadError}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || uploadProgress === 'complete'} 
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {uploadProgress === 'complete' ? 'Processed Successfully' : 
                 isLoading ? 'Processing...' : 'Process Receipt'}
              </Button>

              {uploadProgress === 'complete' && (
                <Button 
                  variant="outline" 
                  onClick={resetDialog} 
                  className="w-full"
                >
                  Upload Another Receipt
                </Button>
              )}
            </div>
          )}

          {anomalyResult && (
            <Alert variant={anomalyResult.anomalyDetected ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-sm">
                {anomalyResult.anomalyDetected ? "Anomaly Found" : "All Clear"}
              </AlertTitle>
              <AlertDescription className="text-xs sm:text-sm">
                {anomalyResult.explanation}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
      
      {/* Camera Dialog */}
      <CameraDialog
        open={cameraDialogOpen}
        onOpenChange={setCameraDialogOpen}
        onCapture={handleCameraCapture}
      />
    </Dialog>
  );
}
