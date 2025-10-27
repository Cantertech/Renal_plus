
import React from 'react';
import type { FoodData } from '../../types';

interface FoodResultScreenProps {
    t: any;
    setView: (view: string) => void;
    foodData: FoodData | null;
}

const FoodResultScreen: React.FC<FoodResultScreenProps> = ({ t, setView, foodData }) => {
    if (!foodData) {
        return (
            <div className="p-6 bg-gray-50 min-h-full text-center">
                <p>No food data available. Please scan an item.</p>
                <button onClick={() => setView('foodScan')} className="mt-4 w-full bg-teal-500 text-white font-semibold py-3 rounded-lg hover:bg-teal-600">{t.scanAgain}</button>
                <button onClick={() => setView('home')} className="mt-4 w-full text-blue-500 font-semibold py-3">{t.backToHome}</button>
            </div>
        );
    }

     const getImpactColor = (score: string) => {
        if (score === "Low Impact") return 'bg-green-100 text-green-800 border-green-400';
        if (score === "Moderate Impact") return 'bg-yellow-100 text-yellow-800 border-yellow-400';
        if (score === "High Impact") return 'bg-red-100 text-red-800 border-red-400';
        return 'bg-gray-100 text-gray-800 border-gray-400';
    };

    return (
        <div className="p-6 bg-gray-50 min-h-full">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{t.foodScanResult}</h2>
            <h3 className="text-xl font-semibold text-center mb-4">{foodData.name}</h3>

             <div className={`p-4 rounded-xl border-2 text-center shadow-md mb-6 ${getImpactColor(foodData.impactScore)}`}>
                <h3 className="text-lg font-semibold text-gray-700">{t.kidneyImpactScore}</h3>
                <p className={`text-2xl font-bold ${
                    foodData.impactScore === 'Low Impact' ? 'text-green-600' :
                    foodData.impactScore === 'Moderate Impact' ? 'text-yellow-600' : 'text-red-600'
                }`}>{foodData.impactScore}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                <h3 className="font-bold text-gray-800 mb-2">{t.nutritionalInfo}</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                    {foodData.nutrients && foodData.nutrients.map((nutrient) => (
                        <div key={nutrient.name} className="flex justify-between border-b pb-1">
                            <span className="font-medium capitalize">{nutrient.name}</span>
                            <span>{nutrient.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                <h3 className="font-bold text-gray-800 mb-2">{t.consumptionAdvice}</h3>
                <p className="text-gray-600 text-sm">{foodData.consumptionImpact}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-800 mb-2">{t.alternatives}</h3>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                    {foodData.alternatives && foodData.alternatives.map((alt, index) => <li key={index}>{alt}</li>)}
                </ul>
            </div>

            <button onClick={() => setView('foodScan')} className="mt-8 w-full bg-teal-500 text-white font-semibold py-3 rounded-lg hover:bg-teal-600">{t.scanAgain}</button>
            <button onClick={() => setView('home')} className="mt-4 w-full text-blue-500 font-semibold py-3">{t.backToHome}</button>
        </div>
    );
};

export default FoodResultScreen;