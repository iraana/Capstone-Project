import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import beep from '../../../assets/beep.mp3';

export const AdminScanner = () => {
  const navigate = useNavigate();
  const [paused, setPaused] = useState(false);

  const handleScan = (result: any) => {
    if (paused) return; // Ignore frames if we are in a cooldown or redirecting

    const rawValue = result?.[0]?.rawValue;

    if (rawValue) {
      if (rawValue.includes('/admin/order/')) {
        setPaused(true); // Pause immediately to prevent duplicate scans
        
        const parts = rawValue.split('/admin/order/');
        const orderNumber = parts[1];

        if (orderNumber) {
          const audio = new Audio(beep);
          audio.play().catch(() => {});
          toast.success('Order found!');
          navigate(`/admin/order/${orderNumber}`);
        } else {
          toast.error('Invalid Order QR Code format.');
          setTimeout(() => setPaused(false), 2000);
        }
      } else {
        setPaused(true);
        toast.error('This does not look like a Gourmet2Go Order QR Code.');
        setTimeout(() => setPaused(false), 2000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <Scanner
          onScan={handleScan}
          onError={() => toast.error('Camera access denied or not supported.')}
          components={{ onOff: true, torch: true, zoom: true, finder: true }}
          styles={{ container: { width: '100%', height: '100%' } }}
        />
      </div>
    </div>
  );
};