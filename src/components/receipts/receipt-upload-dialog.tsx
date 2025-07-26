'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { detectExpenseAnomaly } from '@/ai/flows/expense-anomaly-detection';
import { Loader2, Upload, Camera, AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CameraDialog } from './camera-dialog';

interface ReceiptUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReceiptUploadDialog({ open, onOpenChange }: ReceiptUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [anomalyResult, setAnomalyResult] = useState<{ anomalyDetected: boolean; explanation: string } | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'camera' | null>(null);
  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setUploadMethod('upload');
      setAnomalyResult(null);
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

  const resetDialog = () => {
    setFile(null);
    setAnomalyResult(null);
    setUploadMethod(null);
    setIsLoading(false);
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
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetDialog}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Process Receipt
              </Button>
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
