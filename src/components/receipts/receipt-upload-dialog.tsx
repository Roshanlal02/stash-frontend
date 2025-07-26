'use client';

import { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { detectExpenseAnomaly } from '@/ai/flows/expense-anomaly-detection';
import { Loader2, Upload, Camera, AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ReceiptUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReceiptUploadDialog({ open, onOpenChange }: ReceiptUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [anomalyResult, setAnomalyResult] = useState<{ anomalyDetected: boolean; explanation: string } | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'camera' | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setAnomalyResult(null);
    }
  };

  const handleUploadClick = () => {
    setUploadMethod('upload');
    fileInputRef.current?.click();
  };

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera on mobile devices
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setShowCamera(true);
        setUploadMethod('camera');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: 'Camera Error',
        description: 'Unable to access camera. Please check permissions.',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `receipt-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setFile(file);
            setAnomalyResult(null);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  }, [stopCamera]);

  const handleCameraClick = () => {
    startCamera();
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
    stopCamera();
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
          {!file && !showCamera && (
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

          {/* Camera interface */}
          {showCamera && (
            <div className="space-y-4">
              <div className="relative border rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex gap-2">
                <Button onClick={capturePhoto} className="flex-1">
                  <Camera className="mr-2 h-4 w-4" />
                  Capture Photo
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Cancel
                </Button>
              </div>
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
    </Dialog>
  );
}
