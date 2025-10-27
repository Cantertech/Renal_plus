
import React from 'react';
import type { AIReport } from '../../types';

interface AIReportScreenProps {
    t: any;
    setView: (view: string) => void;
    report: AIReport | null;
    error: string;
}

const AIReportScreen: React.FC<AIReportScreenProps> = ({ t, setView, report, error }) => (
    <div className="p-6 bg-gray-50 min-h-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{t.aiHealthReport}</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {report ? (
            <div className="bg-white p-4 rounded-lg shadow space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Overall Summary</h3>
                <p className="text-gray-700">{report.summary}</p>

                <h3 className="text-lg font-semibold border-b pb-2 pt-2">Key Observations</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {report.observations.map((obs, i) => <li key={i}>{obs}</li>)}
                </ul>

                <h3 className="text-lg font-semibold border-b pb-2 pt-2">Recommended Focus Areas</h3>
                 <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {report.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
                 <p className="text-xs text-gray-500 pt-4">{t.mealPlanDisclaimer}</p>
            </div>
        ) : !error ? (
            <div className="flex flex-col items-center text-center">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
                 <p className="text-xl font-bold">{t.generatingReport}</p>
            </div>
        ) : null}
        <button onClick={() => setView('home')} className="mt-8 w-full text-blue-500 font-semibold py-3">{t.backToHome}</button>
    </div>
);

export default AIReportScreen;
