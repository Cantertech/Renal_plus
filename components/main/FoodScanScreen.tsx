
import React, { useState, useEffect, useRef } from 'react';
import * as geminiService from '../../services/geminiService';
import type { FoodData, AppServices, UserProfile, Vitals, TestResult } from '../../types';

interface FoodScanScreenProps extends AppServices {
    t: any;
    setView: (view: string) => void;
    onFoodAnalyzed: (foodData: FoodData) => void;
}

const FoodScanScreen: React.FC<FoodScanScreenProps> = ({ t, setView, onFoodAnalyzed, user, appId }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let stream: MediaStream;
        async function setupCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (err) { console.error("Error accessing camera: ", err); }
        }
        setupCamera();
        return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
    }, []);
    
    const captureFrame = (): string | null => {
        if (!videoRef.current) return null;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    };

    const handleScanFood = async () => {
        setIsScanning(true);
        setError('');

        const base64Data = captureFrame();
        if (!base64Data) {
            setError("Could not capture image. Please try again.");
            setIsScanning(false);
            return;
        }

        try {
            let userProfile: UserProfile | null = null;
            let latestTest: TestResult | null = null;
            let latestVitals: Vitals | null = null;

            if (user) {
                if (!user.isAnonymous) {
                    const profileData = localStorage.getItem(`renal_plus_profile_${user.uid}`);
                    if (profileData) {
                        userProfile = JSON.parse(profileData);
                    }
                }
                
                const vitalsData = localStorage.getItem(`renal_plus_vitals_${user.uid}`);
                if (vitalsData) {
                    latestVitals = JSON.parse(vitalsData);
                }

                const historyData = localStorage.getItem(`renal_plus_history_${user.uid}`);
                if (historyData) {
                    const history = JSON.parse(historyData);
                    latestTest = history.length > 0 ? history[0] : null;
                }
            }

            let healthContext = "User is a guest.";
            if (userProfile) {
                healthContext = `User Profile: Age ${userProfile.age}, Gender ${userProfile.gender}, Conditions: ${userProfile.conditions.join(', ') || 'None'}.`;
            }
            if (latestTest) {
                healthContext += ` Latest Test: Status - ${latestTest.status}.`;
            }
            if (latestVitals) {
                healthContext += ` Latest Vitals: BP - ${latestVitals.systolic}/${latestVitals.diastolic} mmHg, Glucose - ${latestVitals.glucose} mg/dL.`;
            }
            
            const foodData = await geminiService.getFoodAnalysis(base64Data, healthContext);
            onFoodAnalyzed(foodData);
            setView('foodResult');

        } catch (err) {
            console.error("Food scan failed:", err);
            const message = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(`Analysis failed: ${message}. Please try again.`);
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="relative w-full h-full bg-black flex flex-col items-center justify-center text-white">
            <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover"></video>
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>
            <div className="relative z-10 flex flex-col items-center justify-between h-full w-full p-6">
                <p className="text-lg font-semibold bg-black/50 px-3 py-1 rounded-lg">{t.scanFoodInstruction}</p>
                 {error && <p className="text-red-400 bg-black/70 p-2 rounded-md">{error}</p>}
                <div className="w-full max-w-xs h-48 border-4 border-dashed border-white rounded-lg bg-white/10 flex items-center justify-center">
                </div>
                {isScanning ? (
                    <div className="flex flex-col items-center text-center">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                         <p className="text-xl font-bold">{t.analyzingFood}</p>
                    </div>
                ) : (
                    <div className="w-full max-w-sm flex flex-col gap-4">
                         <button onClick={handleScanFood} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg">{t.scan}</button>
                        <button onClick={() => setView('home')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg">{t.cancel}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodScanScreen;
