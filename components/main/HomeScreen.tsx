
import React from 'react';
import KidneyIcon from '../KidneyIcon';
import type { TestResult } from '../../types';

interface HomeScreenProps {
    t: any;
    setView: (view: string) => void;
    setRecentResult: (result: TestResult | null) => void;
    onGenerateReport: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ t, setView, setRecentResult, onGenerateReport }) => {
    const handleScanStrip = () => {
        setRecentResult(null);
        setView('scan');
    }
     const handleScanFood = () => {
        setView('foodScan');
    }
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50">
            <KidneyIcon />
            <h1 className="text-3xl font-bold text-gray-800 mt-4">{t.appName}</h1>
            <p className="text-gray-600 mt-2 mb-8 max-w-sm">{t.welcomeSubtitle}</p>
            <div className="w-full max-w-sm space-y-4">
                 <button
                    onClick={handleScanStrip}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-transform hover:scale-105"
                >
                    {t.scanStrip}
                </button>
                 <button
                    onClick={handleScanFood}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg"
                >
                    {t.scanFood}
                </button>
                 <button
                    onClick={onGenerateReport}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg"
                >
                    {t.getAiHealthReport}
                </button>
            </div>
        </div>
    );
};

export default HomeScreen;
