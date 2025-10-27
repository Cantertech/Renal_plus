
import React, { useState } from 'react';
import VitalsContent from './VitalsContent';
import HydrationContent from './HydrationContent';
import MealPlannerContent from './MealPlannerContent';
import type { AppServices } from '../../types';

interface WellnessScreenProps extends AppServices {
    t: any;
}

const WellnessScreen: React.FC<WellnessScreenProps> = ({ t, user, appId }) => {
    const [activeTab, setActiveTab] = useState('vitals');

    return (
        <div className="p-4 bg-gray-50 min-h-full">
            <div className="flex border-b mb-4 justify-around">
                <button onClick={() => setActiveTab('vitals')} className={`py-2 px-4 font-semibold ${activeTab === 'vitals' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>{t.vitals}</button>
                <button onClick={() => setActiveTab('hydration')} className={`py-2 px-4 font-semibold ${activeTab === 'hydration' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>{t.hydration}</button>
                <button onClick={() => setActiveTab('mealPlan')} className={`py-2 px-4 font-semibold ${activeTab === 'mealPlan' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>{t.mealPlan}</button>
            </div>
            
            {activeTab === 'vitals' && <VitalsContent t={t} user={user} appId={appId} />}
            {activeTab === 'hydration' && <HydrationContent t={t} user={user} appId={appId} />}
            {activeTab === 'mealPlan' && <MealPlannerContent t={t} />}
        </div>
    );
};

export default WellnessScreen;
