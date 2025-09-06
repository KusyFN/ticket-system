declare module 'react-qr-scanner' {
  import * as React from 'react';

  interface QrScannerProps {
    delay?: number;
    onError?: (error: unknown) => void;
    onScan?: (data: string | null) => void;
    style?: React.CSSProperties;
  }

  const QrScanner: React.ComponentType<QrScannerProps>;

  export default QrScanner;
}
