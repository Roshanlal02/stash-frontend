'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { detectExpenseAnomaly } from '@/ai/flows/expense-anomaly-detection';
import { Loader2, UploadCloud, AlertCircle, CheckCircle, Wifi } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useReceiptAPI, ReceiptAPIError } from '@/lib/receipt-api';

export function ReceiptUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'processing' | 'analyzing' | 'complete' | 'error'>('idle');
  const [anomalyResult, setAnomalyResult] = useState<{ anomalyDetected: boolean; explanation: string } | null>(null);
  const [receiptData, setReceiptData] = useState<any>(null);
  const { toast } = useToast();
  const { uploadAndProcessReceipt } = useReceiptAPI();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setAnomalyResult(null);
      setUploadProgress('idle');
      setReceiptData(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({ title: 'No file selected', description: 'Please select a receipt file to upload.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setUploadProgress('uploading');
    setAnomalyResult(null);

    try {
      // Upload and process receipt with API
      setUploadProgress('processing');
      const uploadResult = await uploadAndProcessReceipt(file);
      
      if (uploadResult.success && uploadResult.data) {
        setReceiptData(uploadResult.data);
        setUploadProgress('analyzing');
        
        // Run anomaly detection with real data
        const receiptInfo = `Merchant: ${uploadResult.data.merchant}, Date: ${uploadResult.data.date}, Amount: ${uploadResult.data.amount}, Category: ${uploadResult.data.category}`;
        const spendingPatterns = `Average ${uploadResult.data.category?.toLowerCase()} expense analysis needed.`;

        try {
          const anomalyResult = await detectExpenseAnomaly({ 
            receiptData: receiptInfo, 
            spendingPatterns 
          });
          
          setAnomalyResult(anomalyResult);
          setUploadProgress('complete');

          if (anomalyResult.anomalyDetected) {
            toast({
              title: 'Receipt Processed - Anomaly Detected!',
              description: `${uploadResult.data.merchant}: $${uploadResult.data.amount}. ${anomalyResult.explanation}`,
              variant: 'destructive',
              duration: 8000,
            });
          } else {
            toast({
              title: 'Receipt Processed Successfully',
              description: `${uploadResult.data.merchant}: $${uploadResult.data.amount} - No anomalies detected.`,
              duration: 5000,
            });
          }
        } catch (anomalyError) {
          console.warn('Anomaly detection failed:', anomalyError);
          setUploadProgress('complete');
          toast({
            title: 'Receipt Uploaded Successfully',
            description: `${uploadResult.data.merchant}: $${uploadResult.data.amount} - Processed successfully.`,
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Receipt upload error:', error);
      setUploadProgress('error');
      
      let errorMessage = 'Failed to process receipt. Please try again.';
      if (error instanceof ReceiptAPIError) {
        errorMessage = error.message;
      }

      toast({ 
        title: 'Processing Error', 
        description: errorMessage, 
        variant: 'destructive',
        duration: 8000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle>Upload Receipt</CardTitle>
        <CardDescription>Upload an image of your receipt for processing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center text-center p-4 sm:p-6 border-2 border-dashed rounded-lg min-h-[120px]">
            <UploadCloud className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-2 sm:mb-4" />
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Drag &amp; drop a file or</p>
            <Input 
              id="receipt-upload" 
              type="file" 
              onChange={handleFileChange} 
              className="w-full max-w-[200px] text-xs sm:text-sm" 
              accept="image/*"
              disabled={isLoading}
            />
            {file && <p className="text-xs sm:text-sm mt-2 text-muted-foreground truncate max-w-full">{file.name}</p>}
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
        
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !file || uploadProgress === 'complete'} 
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {uploadProgress === 'complete' ? 'Processed Successfully' : 
           isLoading ? 'Processing...' : 'Process Receipt'}
        </Button>

        {anomalyResult && (
            <Alert variant={anomalyResult.anomalyDetected ? "destructive" : "default"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-sm">{anomalyResult.anomalyDetected ? "Anomaly Found" : "All Clear"}</AlertTitle>
                <AlertDescription className="text-xs sm:text-sm">{anomalyResult.explanation}</AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}
