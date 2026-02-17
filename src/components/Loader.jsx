import { useEffect, useState } from 'react';

export default function Loader({ onComplete }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-gold font-display">
            <div className="text-4xl md:text-6xl font-black tracking-widest mb-4">
                KARTHIK
            </div>
            <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gold transition-all duration-75 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="mt-2 text-sm font-mono text-gold/60">
                {progress}%
            </div>
        </div>
    );
}
