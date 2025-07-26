'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { detectExpenseAnomaly } from '@/ai/flows/expense-anomaly-detection';
import { Loader2, UploadCloud, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ReceiptUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [anomalyResult, setAnomalyResult] = useState<{ anomalyDetected: boolean; explanation: string } | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setAnomalyResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({ title: 'No file selected', description: 'Please select a receipt file to upload.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setAnomalyResult(null);

    // Mocking file processing and data extraction
    const receiptData = `Merchant: Fancy Restaurant, Date: ${new Date().toISOString().split('T')[0]}, Amount: 150.00, Category: Dining`;
    const spendingPatterns = 'Average dining expense is $50. User dines out 4 times a month.';

    try {
      const result = await detectExpenseAnomaly({ receiptData, spendingPatterns });
      setAnomalyResult(result);
      if (result.anomalyDetected) {
        toast({
          title: 'Anomaly Detected!',
          description: result.explanation,
          variant: 'destructive',
          duration: 9000,
        });
      } else {
        toast({
            title: 'Upload Successful',
            description: 'Receipt processed, no anomalies found.',
        });
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to process receipt.', variant: 'destructive' });
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
            />
            {file && <p className="text-xs sm:text-sm mt-2 text-muted-foreground truncate max-w-full">{file.name}</p>}
        </div>
        
        <Button onClick={handleSubmit} disabled={isLoading || !file} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Process Receipt
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
