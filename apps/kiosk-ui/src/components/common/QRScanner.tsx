import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { IoClose, IoCheckmarkCircle } from 'react-icons/io5';

interface QRScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  validationError?: string;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose, validationError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [detected, setDetected] = useState(false);

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationRef.current = requestAnimationFrame(scanQRCode);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth', // Essaie les deux inversions
    });

    if (code && !detected) {
      console.log('QR Code brut détecté:', code);
      console.log('Contenu:', code.data);
      console.log('Type:', typeof code.data);
      console.log('Longueur:', code.data.length);
      
      if (code.data && code.data.length > 0) {
        console.log('✓ QR Code valide accepté:', code.data);
        setDetected(true);
        
        setTimeout(() => {
          onScan(code.data);
          // Réinitialiser pour permettre un nouveau scan
          setTimeout(() => setDetected(false), 1500);
        }, 500);
        // Ne pas return ici, continuer la boucle pour permettre un nouveau scan
      } else {
        console.log('✗ QR Code détecté mais vide');
      }
    }
    
    animationRef.current = requestAnimationFrame(scanQRCode);
  };

  const stopCamera = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsScanning(false);
  };

  const startCamera = async () => {
    try {
      // utilisation de l'API native navigator.mediaDevices (accessible via Electron)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        
        videoRef.current.onloadedmetadata = () => {
          scanQRCode();
        };
      }
    } catch (err) {
      console.error('Erreur accès caméra:', err);
      setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  useEffect(() => {
    const initCamera = async () => {
      await startCamera();
    };
    initCamera();
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative bg-stone-900 rounded-3xl p-8 max-w-2xl w-full mx-4 border-2 border-stone-800 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-3 rounded-full bg-stone-800 text-white hover:bg-stone-700 transition-all z-50"
        >
          <IoClose className="w-8 h-8" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2 font-serif">Scanner le QR Code</h2>
          <p className="text-stone-400">Positionnez le QR code devant la caméra</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border-4 border-primary-500 shadow-[0_0_30px_rgba(244,63,94,0.3)] bg-black">
          <video
            ref={videoRef}
            className="w-full h-auto"
            autoPlay
            playsInline
            muted
          />
          
          <canvas ref={canvasRef} className="hidden" />

          {isScanning && !detected && (
            <div className="absolute top-4 left-4 bg-green-500/90 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              Scan en cours...
            </div>
          )}

          {detected && (
            <div className="absolute inset-0 flex items-center justify-center bg-green-500/80">
              <div className="text-center text-white">
                <IoCheckmarkCircle className="w-20 h-20 mx-auto mb-4" />
                <p className="text-2xl font-bold">QR Code détecté !</p>
              </div>
            </div>
          )}

          {!detected && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500"></div>
              </div>
            </div>
          )}
        </div>

        {(error || validationError) && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-200 text-center">
            {validationError || error}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-stone-500">
          <p>Le scan se fera automatiquement dès que le QR code sera détecté</p>
        </div>
      </div>
    </div>
  );
};
