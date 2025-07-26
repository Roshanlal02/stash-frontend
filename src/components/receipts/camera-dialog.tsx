'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Camera, X, RotateCcw } from 'lucide-react';

interface CameraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapture: (file: File) => void;
}

export function CameraDialog({ open, onOpenChange, onCapture }: CameraDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: 'Camera Error',
        description: 'Unable to access camera. Please check permissions and try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [facingMode, toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Draw the current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob and create file
        canvas.toBlob((blob) => {
          if (blob) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const file = new File([blob], `receipt-${timestamp}.jpg`, { 
              type: 'image/jpeg' 
            });
            
            // Call the onCapture callback with the file
            onCapture(file);
            
            // Close the dialog
            handleClose();
            
            toast({
              title: 'Photo Captured',
              description: 'Receipt photo captured successfully!',
            });
          }
        }, 'image/jpeg', 0.9);
      }
    }
  }, [onCapture, toast]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleClose = () => {
    stopCamera();
    onOpenChange(false);
  };

  // Start camera when dialog opens
  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [open, startCamera, stopCamera]);

  // Restart camera when facing mode changes
  useEffect(() => {
    if (open) {
      startCamera();
    }
  }, [facingMode, startCamera, open]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Take Receipt Photo
          </DialogTitle>
          <DialogDescription>
            Position your receipt in the camera view and tap capture when ready.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Camera viewfinder */}
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-black aspect-video">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-white text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                  <p>Starting camera...</p>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay guidelines */}
                <div className="absolute inset-4 border-2 border-white/50 rounded-lg pointer-events-none">
                  <div className="absolute top-2 left-2 text-white/70 text-xs bg-black/50 px-2 py-1 rounded">
                    Position receipt here
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Camera controls */}
          <div className="flex justify-between items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleCamera}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Flip Camera
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={capturePhoto}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Capture
              </Button>
            </div>
          </div>
        </div>
        
        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
