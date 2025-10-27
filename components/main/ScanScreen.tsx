
import React, { useState, useEffect, useRef } from 'react';
import type { TestResult } from '../../types';

interface ScanScreenProps {
    t: any;
    setView: (view: string) => void;
    addResult: (result: Omit<TestResult, 'id' | 'timestamp'>) => void;
}

const ScanScreen: React.FC<ScanScreenProps> = ({ t, setView, addResult }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        let stream: MediaStream;
        async function setupCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera: ", err);
            }
        }
        setupCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            const random = Math.random();
            let resultData;
            if (random < 0.7) {
                resultData = { status: t.statusNormal, color: 'green', rec: t.recNormal, biomarkers: { [t.protein]: t.negative, [t.albumin]: t.negative, [t.ph]: '6.5', [t.nitrite]: t.negative, [t.blood]: t.negative } };
            } else if (random < 0.9) {
                resultData = { status: t.statusMild, color: 'yellow', rec: t.recMild, biomarkers: { [t.protein]: t.trace, [t.albumin]: t.trace, [t.ph]: '7.5', [t.nitrite]: t.negative, [t.blood]: t.trace } };
            } else {
                resultData = { status: t.statusHigh, color: 'red', rec: t.recHigh, biomarkers: { [t.protein]: t.moderate, [t.albumin]: t.moderate, [t.ph]: '8.0', [t.nitrite]: t.positive, [t.blood]: t.moderate } };
            }
            addResult(resultData);
            setView('result');
        }, 3000);
    };

    return (
        <div className="relative w-full h-full bg-black flex flex-col items-center justify-center text-white">
            <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover"></video>
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-between h-full w-full p-6">
                <p className="text-lg font-semibold bg-black/50 px-3 py-1 rounded-lg">{t.scanInstruction}</p>
                <div className="w-full max-w-xs h-24 border-4 border-dashed border-white rounded-lg bg-white/10"></div>
                {isScanning ? (
                    <div className="flex flex-col items-center text-center">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                         <p className="text-xl font-bold">{t.analyzing}</p>
                    </div>
                ) : (
                    <div className="w-full max-w-sm flex flex-col gap-4">
                         <button onClick={handleScan} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg">{t.scan}</button>
                        <button onClick={() => setView('home')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg">{t.cancel}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScanScreen;
