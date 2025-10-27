import React, { useState } from 'react';
import * as geminiService from '../../services/geminiService';

interface MealPlannerContentProps {
    t: any;
}

interface MealPlan {
    breakfast: { name: string, description: string };
    lunch: { name: string, description: string };
    dinner: { name: string, description: string };
}

const MealPlannerContent: React.FC<MealPlannerContentProps> = ({ t }) => {
    const [preferences, setPreferences] = useState('');
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const generateMealPlan = async () => {
        setIsGenerating(true);
        setMealPlan(null);
        setError('');

        try {
            const plan = await geminiService.getMealPlan(preferences);
            setMealPlan(plan);
        } catch (err) {
            console.error("Meal plan generation failed:", err);
            const message = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(`An error occurred: ${message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 text-center">{t.mealPlanner}</h2>
            <p className="text-gray-600 text-center mb-4 text-sm">{t.mealPlannerDesc}</p>
            <label htmlFor="prefs" className="block text-sm font-medium text-gray-700">{t.preferences}</label>
            <input 
                type="text" 
                id="prefs"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button onClick={generateMealPlan} disabled={isGenerating} className="mt-4 w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400">
                {isGenerating ? t.generating : t.generatePlan}
            </button>
             {error && <p className="text-red-500 text-center mt-4">{error}</p>}
             {mealPlan && (
                <div className="mt-4 space-y-4 border-t pt-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="font-bold text-blue-600">{t.breakfast}</h3>
                        <p className="font-semibold text-sm text-gray-800">{mealPlan.breakfast.name}</p>
                        <p className="text-xs text-gray-600">{mealPlan.breakfast.description}</p>
                    </div>
                     <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="font-bold text-blue-600">{t.lunch}</h3>
                        <p className="font-semibold text-sm text-gray-800">{mealPlan.lunch.name}</p>
                        <p className="text-xs text-gray-600">{mealPlan.lunch.description}</p>
                    </div>
                     <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="font-bold text-blue-600">{t.dinner}</h3>
                        <p className="font-semibold text-sm text-gray-800">{mealPlan.dinner.name}</p>
                        <p className="text-xs text-gray-600">{mealPlan.dinner.description}</p>
                    </div>
                    <p className="text-xs text-gray-500 text-center pt-2">{t.mealPlanDisclaimer}</p>
                </div>
            )}
        </div>
    );
};

export default MealPlannerContent;