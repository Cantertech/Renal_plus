
import React from 'react';
import type { TestResult } from '../../types';

interface HistoryScreenProps {
    t: any;
    history: TestResult[];
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ t, history }) => {
    const getStatusColor = (status: string) => {
        if (status === t.statusNormal) return 'bg-green-500';
        if (status === t.statusMild) return 'bg-yellow-500';
        if (status === t.statusHigh) return 'bg-red-500';
        return 'bg-gray-500';
    };

    return (
        <div>
            {history.length === 0 ? (
                <p className="text-gray-500 text-center mt-8">{t.noHistory}</p>
            ) : (
                <ul className="space-y-3">
                    {history.map((item, index) => (
                        <li key={item.id || index} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                            <div className="flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-4 ${getStatusColor(item.status)}`}></span>
                                <div>
                                    <p className="font-semibold text-gray-800">{item.status}</p>
                                    <p className="text-sm text-gray-500">{new Date(item.timestamp).toLocaleDateString()} - {new Date(item.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HistoryScreen;
