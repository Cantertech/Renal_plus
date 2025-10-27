
import React, { useState, useEffect } from 'react';
import type { AppServices, Vitals, UserProfile } from '../../types';
import * as geminiService from '../../services/geminiService';

interface VitalsContentProps extends AppServices {
    t: any;
}

const VitalsContent: React.FC<VitalsContentProps> = ({ t, user, appId }) => {
    const [vitals, setVitals] = useState({ systolic: '', diastolic: '', glucose: '', weight: '', height: '' });
    const [latestVitals, setLatestVitals] = useState<Vitals | null>(null);
    const [analysis, setAnalysis] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    useEffect(() => {
        if (user) {
            const storedVitals = localStorage.getItem(`renal_plus_vitals_${user.uid}`);
            if (storedVitals) {
                try {
                    setLatestVitals(JSON.parse(storedVitals));
                } catch (e) {
                    setLatestVitals(null);
                }
            } else {
                setLatestVitals(null);
            }
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVitals(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveVitals = async () => {
        if (!user) return;
        const vitalsData: Vitals = {
            systolic: vitals.systolic || null,
            diastolic: vitals.diastolic || null,
            glucose: vitals.glucose || null,
            weight: vitals.weight || null,
            height: vitals.height || null,
            timestamp: new Date().toISOString(),
            bmi: ''
        };
        if (vitals.weight && vitals.height) {
            const heightInMeters = parseFloat(vitals.height) / 100;
            if (heightInMeters > 0) {
               vitalsData.bmi = (parseFloat(vitals.weight) / (heightInMeters * heightInMeters)).toFixed(1);
            }
        }
        try {
            localStorage.setItem(`renal_plus_vitals_${user.uid}`, JSON.stringify(vitalsData));
            setLatestVitals(vitalsData);
            setVitals({ systolic: '', diastolic: '', glucose: '', weight: '', height: '' });
        } catch (error) {
            console.error("Error saving vitals:", error);
        }
    };

    const handleGetAnalysis = async () => {
        if (!user || !latestVitals) return;
        setIsAnalyzing(true);
        setAnalysis('');
        try {
            let userProfile: UserProfile | null = null;
            if (!user.isAnonymous) {
                const profileData = localStorage.getItem(`renal_plus_profile_${user.uid}`);
                if (profileData) {
                    userProfile = JSON.parse(profileData);
                }
            }
            const result = await geminiService.getVitalsAnalysis(latestVitals, userProfile);
            setAnalysis(result);
        } catch (error) {
            console.error("Error getting vitals analysis:", error);
            const message = error instanceof Error ? error.message : "An unknown error occurred.";
            setAnalysis(`Sorry, an error occurred while analyzing your vitals: ${message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getStatus = (vital: Vitals | null) => {
        if (!vital) return null;
        const statuses = [];
        if (vital.systolic && vital.diastolic && (parseFloat(vital.systolic) > 140 || parseFloat(vital.diastolic) > 90)) statuses.push({ text: t.highBP, color: 'red' });
        if (vital.glucose && parseFloat(vital.glucose) > 126) statuses.push({ text: t.highGlucose, color: 'red' });
        if (vital.bmi && parseFloat(vital.bmi) > 30) statuses.push({ text: t.overweight, color: 'yellow' });

        if (statuses.length === 0) return { text: t.normalVitals, color: 'green' };
        return statuses.find(s => s.color === 'red') || statuses[0];
    };
    
    const latestStatus = getStatus(latestVitals);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800">{t.trackVitals}</h2>
                <p className="text-gray-600 text-sm">{t.trackVitalsDesc}</p>
            </div>
            
            {latestVitals ? (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-bold text-lg mb-2">{t.latestVitals}</h3>
                    <p className="text-sm text-gray-500 mb-3">{t.lastRecorded} {new Date(latestVitals.timestamp).toLocaleDateString()}</p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div><p className="font-bold text-xl">{latestVitals.systolic || 'N/A'}/{latestVitals.diastolic || 'N/A'}</p><p className="text-xs text-gray-500">{t.bloodPressure}</p></div>
                        <div><p className="font-bold text-xl">{latestVitals.glucose || 'N/A'}</p><p className="text-xs text-gray-500">{t.bloodGlucose}</p></div>
                        <div><p className="font-bold text-xl">{latestVitals.bmi || 'N/A'}</p><p className="text-xs text-gray-500">{t.bodyMassIndex}</p></div>
                    </div>
                     {latestStatus && <div className={`mt-4 p-2 rounded-md text-center text-sm font-semibold ${latestStatus.color === 'red' ? 'bg-red-100 text-red-800' : latestStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{latestStatus.text}</div>}
                     <button onClick={handleGetAnalysis} disabled={isAnalyzing} className="w-full mt-4 bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400">
                        {isAnalyzing ? t.generating : t.getAiVitalsAnalysis}
                    </button>
                    {analysis && (
                        <div className="mt-4 bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{analysis}</p>
                        </div>
                    )}
                </div>
            ) : (
                 <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                    <p className="text-gray-500">{t.noVitals}</p>
                 </div>
            )}


            <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                 <div>
                    <label className="font-semibold block mb-1 text-sm">{t.bloodPressure}</label>
                    <div className="flex gap-2">
                        <input type="number" name="systolic" placeholder={t.systolic} value={vitals.systolic} onChange={handleChange} className="w-full p-2 border rounded-md text-sm"/>
                        <input type="number" name="diastolic" placeholder={t.diastolic} value={vitals.diastolic} onChange={handleChange} className="w-full p-2 border rounded-md text-sm"/>
                    </div>
                </div>
                 <div>
                    <label className="font-semibold block mb-1 text-sm">{t.bloodGlucose}</label>
                    <input type="number" name="glucose" placeholder={t.glucoseLevel} value={vitals.glucose} onChange={handleChange} className="w-full p-2 border rounded-md text-sm"/>
                </div>
                <div>
                    <label className="font-semibold block mb-1 text-sm">{t.bodyMassIndex}</label>
                     <div className="flex gap-2">
                        <input type="number" name="weight" placeholder={t.weight} value={vitals.weight} onChange={handleChange} className="w-full p-2 border rounded-md text-sm"/>
                        <input type="number" name="height" placeholder={t.height} value={vitals.height} onChange={handleChange} className="w-full p-2 border rounded-md text-sm"/>
                    </div>
                </div>
                <button onClick={handleSaveVitals} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600">{t.saveVitals}</button>
            </div>
        </div>
    );
};

export default VitalsContent;
