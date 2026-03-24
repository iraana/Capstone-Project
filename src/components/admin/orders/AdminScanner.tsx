import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle } from 'lucide-react';
import beep from '../../../assets/beep.mp3';

export const AdminScanner = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  const handleScan = (result: any) => {
    if (paused) return;

    const rawValue = result?.[0]?.rawValue;

    if (rawValue) {
      if (rawValue.includes('/admin/order/')) {
        setPaused(true);
        const parts = rawValue.split('/admin/order/');
        const orderNumber = parts[1];

        if (orderNumber) {
          const audio = new Audio(beep);
          audio.play().catch(() => {});
          navigate(`/admin/order/${orderNumber}`);
        } else {
          setError('Invalid Order QR Code format.');
          setPaused(false);
        }
      } else {
        setError('This does not look like a Gourmet2Go Order QR Code.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <Scanner
          onScan={handleScan}
          onError={() => setError('Camera access denied or not supported.')}
          components={{ onOff: true, torch: true, zoom: true, finder: true }}
          styles={{ container: { width: '100%', height: '100%' } }}
        />
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950 text-red-700 dark:text-red-300 px-4 py-3 text-sm max-w-md text-center">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

