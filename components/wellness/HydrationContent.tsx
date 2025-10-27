
import React, { useState, useEffect } from 'react';
import type { AppServices } from '../../types';

interface HydrationContentProps extends AppServices {
    t: any;
}

interface HydrationData {
    intake: number;
    lastUpdated: string;
    [key: string]: any;
}

const HydrationContent: React.FC<HydrationContentProps> = ({ t, user, appId }) => {
    const [waterIntake, setWaterIntake] = useState(0);
    const dailyGoal = 2000;

    useEffect(() => {
        if (user) {
            const storedDate = localStorage.getItem(`renal_plus_hydration_date_${user.uid}`);
            const today = new Date().toISOString().slice(0, 10);
            if (storedDate === today) {
                const storedIntake = localStorage.getItem(`renal_plus_hydration_intake_${user.uid}`);
                setWaterIntake(storedIntake ? parseInt(storedIntake, 10) : 0);
            } else {
                localStorage.setItem(`renal_plus_hydration_date_${user.uid}`, today);
                localStorage.setItem(`renal_plus_hydration_intake_${user.uid}`, '0');
                setWaterIntake(0);
            }
        } else {
            const storedDate = localStorage.getItem('renal_plus_hydration_date');
            const today = new Date().toISOString().slice(0, 10);
            if (storedDate === today) {
                const storedIntake = localStorage.getItem('renal_plus_hydration_intake');
                setWaterIntake(storedIntake ? parseInt(storedIntake, 10) : 0);
            } else {
                localStorage.setItem('renal_plus_hydration_date', today);
                localStorage.setItem('renal_plus_hydration_intake', '0');
                setWaterIntake(0);
            }
        }
    }, [user]);

    const handleLogWater = (amount: number) => {
        const newIntake = waterIntake + amount;
        
        if (user) {
            localStorage.setItem(`renal_plus_hydration_intake_${user.uid}`, newIntake.toString());
        } else {
            localStorage.setItem('renal_plus_hydration_intake', newIntake.toString());
        }
        setWaterIntake(newIntake);
    };
    
    const filledGlasses = Math.floor(waterIntake / 250);
    const totalGlasses = dailyGoal / 250;

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
             <h2 className="text-xl font-bold text-gray-800 text-center mb-4">{t.hydrationTracker}</h2>
             <div className="text-center mb-4">
                 <p className="text-gray-600">{t.todaysIntake}</p>
                 <p className="text-2xl font-bold text-blue-600">{waterIntake}ml / {dailyGoal}ml</p>
             </div>
             <div className="flex justify-center flex-wrap gap-2 mb-4">
                {[...Array(totalGlasses)].map((_, i) => (
                    <svg key={i} className={`w-8 h-8 transition-colors ${i < filledGlasses ? 'text-blue-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                       <path d="M10 3.5a1.5 1.5 0 013 0V5h-3V3.5zM10 7V5.5h1.5V7H10zM8.5 7H7V5.5h1.5V7zm3-1.5H10V4h1.5v1.5zm-3 0H7V4h1.5v1.5zM6 7H4.5V5.5H6V7zM4.5 4H6V2.5H4.5V4zM14 7h-1.5V5.5H14V7zm-1.5-3H14V2.5h-1.5V4zM3.5 16.5A2.5 2.5 0 011 14V8h18v6a2.5 2.5 0 01-2.5 2.5h-13z"/>
                    </svg>
                ))}
             </div>
             <div className="grid grid-cols-2 gap-3">
                 <button onClick={() => handleLogWater(250)} className="bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200">{t.addGlass}</button>
                 <button onClick={() => handleLogWater(500)} className="bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200">{t.addBottle}</button>
             </div>
        </div>
    );
}

export default HydrationContent;
