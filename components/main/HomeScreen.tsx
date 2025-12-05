
import React from 'react';
import logo from '../assets/logo.png';
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
        <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="bg-white p-4 rounded-3xl shadow-sm mb-6">
                <img src={logo} alt="Renal Care Logo" className="w-20 h-20 object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t.appName}</h1>
            <p className="text-gray-500 mt-3 mb-10 max-w-xs leading-relaxed">{t.welcomeSubtitle}</p>

            <div className="w-full max-w-sm space-y-4">
                <button
                    onClick={handleScanStrip}
                    className="group w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-blue-200 shadow-xl transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                    <span>{t.scanStrip}</span>
                </button>

                <button
                    onClick={handleScanFood}
                    className="group w-full bg-white border border-gray-100 hover:border-teal-500 text-gray-700 hover:text-teal-600 font-semibold py-4 px-6 rounded-2xl shadow-sm hover:shadow-md transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-teal-500 group-hover:text-teal-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                    <span>{t.scanFood}</span>
                </button>

                <button
                    onClick={onGenerateReport}
                    className="group w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-purple-200 shadow-xl transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                    <span>{t.getAiHealthReport}</span>
                </button>
            </div>
        </div>
    );
};

export default HomeScreen;
