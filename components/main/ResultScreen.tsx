
import React, { useState, useEffect } from 'react';
import type { TestResult } from '../../types';
import * as geminiService from '../../services/geminiService';

interface ResultScreenProps {
    t: any;
    setView: (view: string) => void;
    recentResult: TestResult | null;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ t, setView, recentResult }) => {
    const [geminiInsight, setGeminiInsight] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        // Clear insights when a new result comes in
        setGeminiInsight('');
    }, [recentResult]);
    
    if (!recentResult) {
        return (
            <div className="p-4 text-center">
                <p>No result found. Please scan again.</p>
                <button onClick={() => setView('home')} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg">{t.backToHome}</button>
            </div>
        );
    }

    const getGeminiInsights = async () => {
        setIsGenerating(true);
        setGeminiInsight('');
        try {
            const insightText = await geminiService.getTestStripInsights(recentResult);
            setGeminiInsight(insightText);
        } catch (error) {
            console.error("Gemini API call failed:", error);
            setGeminiInsight("An error occurred. Please check your connection and try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const { status, color, rec, biomarkers } = recentResult;
    const colorClasses = { green: 'bg-green-100 text-green-800 border-green-400', yellow: 'bg-yellow-100 text-yellow-800 border-yellow-400', red: 'bg-red-100 text-red-800 border-red-400' };

    return (
        <div className="p-6 bg-gray-50 min-h-full">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{t.results}</h2>
            <div className={`p-6 rounded-xl border-2 text-center shadow-md ${colorClasses[color]}`}>
                <h3 className="text-lg font-semibold text-gray-700">{t.healthStatus}</h3>
                <p className={`text-3xl font-bold ${color === 'green' ? 'text-green-600' : color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>{status}</p>
            </div>
            <div className="mt-6 bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-800 mb-2">{t.biomarkers}</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                     {Object.entries(biomarkers).map(([key, value]) => (<div key={key} className="flex justify-between border-b pb-1"><span className="font-medium capitalize">{t[key.toLowerCase()] || key}</span><span>{value}</span></div>))}
                </div>
            </div>
            <div className="mt-6 bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-800 mb-2">{t.recommendation}</h3>
                <p className="text-gray-600">{rec}</p>
            </div>

            {color !== 'green' && (
                <div className="mt-6">
                    <button onClick={getGeminiInsights} disabled={isGenerating} className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400">
                        {isGenerating ? t.generating : t.getAiInsights}
                    </button>
                </div>
            )}
            
            {geminiInsight && (
                 <div className="mt-6 bg-purple-50 p-4 rounded-xl shadow-sm border border-purple-200">
                    <h3 className="font-bold text-purple-800 mb-2">{t.aiInsights}</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{geminiInsight}</p>
                </div>
            )}

            <button onClick={() => setView('home')} className="mt-8 w-full text-blue-500 font-semibold py-3">{t.done}</button>
        </div>
    );
};

export default ResultScreen;
