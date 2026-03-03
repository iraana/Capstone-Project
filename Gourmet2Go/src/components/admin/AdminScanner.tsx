import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import beep from '../../assets/beep.mp3';

export const AdminScanner = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [paused, setPaused] = useState(false);

    const handleScan = (result: any) => {
        if (paused) return; // Ignores further scans if already scanned something

        const rawValue = result?.[0]?.rawValue;
        
        if (rawValue) {
            // If it contains the order route
            if (rawValue.includes('/admin/order/')) {
                setPaused(true); // Stops scanning
                const parts = rawValue.split('/admin/order/');
                const orderNumber = parts[1];
                
                // If order number exists
                if (orderNumber) {
                    const audio = new Audio(beep); // Play beep sound
                    audio.play().catch(() => {}); 
                    
                    navigate(`/admin/order/${orderNumber}`); // Navigate to the order detail
                } else {
                    setError("Invalid Order QR Code format."); // Error
                    setPaused(false); // Unpauses scanner for more scanning
                }
            } else {
                setError("This does not look like a Gourmet2Go Order QR Code."); // Not from our app
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="p-4 flex items-center gap-4 z-10 backdrop-blur-md sticky top-0">
                <button 
                    onClick={() => navigate('/admin')}
                    className="p-2transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">Scan Order QR</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative px-4">
                <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden border-2 border-blue-500 relative shadow-2xl shadow-blue-900/20">
                    <Scanner 
                        onScan={handleScan}
                        onError={(_err) => setError("Camera access denied or not supported.")}
                        components={{
                            onOff: true,
                            torch: true,
                            zoom: true,
                            finder: true,
                        }}
                        styles={{
                            container: { width: '100%', height: '100%' }
                        }}
                    />
                </div>

                <div className="mt-8 text-center space-y-4">
                    <p className="text-zinc-400 text-sm">
                        Point your camera at a customer's order QR code.
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center gap-2 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-2">
                            <AlertCircle size={18} className="shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};