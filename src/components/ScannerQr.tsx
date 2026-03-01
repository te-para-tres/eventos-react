import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Html5Qrcode } from "html5-qrcode";

interface ScannerQrProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

export interface ScannerQrRef {
  stopScanner: () => Promise<void>;
}

const ScannerQr = forwardRef<ScannerQrRef, ScannerQrProps>(
  ({ onScan, onError }, ref) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const stopAndClear = async () => {
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            await scannerRef.current.stop();
          }
          await scannerRef.current.clear();
          setIsScanning(false);
        } catch (err) {
          console.error("Error al detener scanner:", err);
        }
      }
    };

    useImperativeHandle(ref, () => ({
      stopScanner: stopAndClear,
    }));

    useEffect(() => {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      const startScanner = async () => {
        try {
          await scanner.start(
            { facingMode: "environment" },
            {
              fps: 15,
            },
            (decodedText) => {
              onScan(decodedText);
            },
            (errorMessage) => {
            }
          );
          setIsScanning(true);
        } catch (err) {
          onError?.(err instanceof Error ? err.message : "Error desconocido");
        }
      };

      startScanner();

      return () => {
        stopAndClear();
      };
    }, [onScan, onError]);

    return (
      <div>
        <div id="qr-reader" style={{ width: 800 }}></div>
        {isScanning && <p>Escaneando...</p>}
      </div>
    );
  }
);

ScannerQr.displayName = "ScannerQr";

export default ScannerQr;
