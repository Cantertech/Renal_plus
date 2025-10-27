
import React, { useState, useRef } from 'react';

interface HealthyFoodSortGameProps {
    t: any;
    setView: (view: string) => void;
}

const HealthyFoodSortGame: React.FC<HealthyFoodSortGameProps> = ({ t, setView }) => {
    const allFoods = useRef([
        { name: 'Apple', emoji: '🍎', type: 'good', info: 'Low in potassium and high in fiber.' },
        { name: 'Cabbage', emoji: '🥬', type: 'good', info: 'Packed with vitamins and low in potassium.' },
        { name: 'Grilled Tilapia', emoji: '🐟', type: 'good', info: 'A great source of high-quality protein and omega-3s.' },
        { name: 'Bell Pepper', emoji: '🫑', type: 'good', info: 'Low in potassium and an excellent source of Vitamin C.' },
        { name: 'Watermelon', emoji: '🍉', type: 'good', info: 'Hydrating and contains beneficial antioxidants.' },
        { name: 'Kontomire Stew (Low Salt)', emoji: '🍲', type: 'good', info: 'Rich in vitamins if prepared with minimal salt.' },
        { name: 'Egg Whites', emoji: '🥚', type: 'good', info: 'Excellent high-quality protein, low in phosphorus.' },
        { name: 'Cauliflower', emoji: '🥦', type: 'good', info: 'A great low-potassium vegetable substitute.' },
        { name: 'Salty Snacks (Plantain Chips)', emoji: '🥨', type: 'bad', info: 'Often high in sodium, which can raise blood pressure.' },
        { name: 'Soda', emoji: '🥤', type: 'bad', info: 'High in sugar and phosphorus additives.' },
        { name: 'Processed Meat (Sausage)', emoji: '🌭', type: 'bad', info: 'Very high in sodium and preservatives.' },
        { name: 'Canned Soup (Palm Nut Soup)', emoji: '🥫', type: 'bad', info: 'Canned versions can be very high in sodium.' },
        { name: 'Fried Yam/Potato', emoji: '🍟', type: 'bad', info: 'High in fat and often salt; potassium can be high.' },
        { name: 'Stock Cubes (e.g., Maggi)', emoji: '🧱', type: 'bad', info: 'Extremely high in sodium.' },
        { name: 'Avocado', emoji: '🥑', type: 'bad', info: 'Healthy, but very high in potassium for kidney patients.' }, 
        { name: 'Banana', emoji: '🍌', type: 'bad', info: 'A healthy fruit, but EXTREMELY high in potassium.' },
    ].sort(() => Math.random() - 0.5));

    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; info: string } | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const currentFood = allFoods.current[currentIndex];

    const handleChoice = (choice: 'good' | 'bad') => {
        if (feedback) return;
        const isCorrect = choice === currentFood.type;
        if (isCorrect) setScore(s => s + 1);
        setFeedback({ isCorrect, info: currentFood.info });

        setTimeout(() => {
            if (currentIndex + 1 < allFoods.current.length) {
                setCurrentIndex(i => i + 1);
                setFeedback(null);
            } else {
                setGameOver(true);
            }
        }, 2500);
    };
    
    const restartGame = () => {
        allFoods.current.sort(() => Math.random() - 0.5);
        setCurrentIndex(0);
        setScore(0);
        setFeedback(null);
        setGameOver(false);
    };

    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50">
                <h2 className="text-3xl font-bold text-gray-800">{t.finalScore}</h2>
                <p className="text-6xl font-bold my-4">{score} / {allFoods.current.length}</p>
                <button onClick={restartGame} className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600">{t.playAgain}</button>
                <button onClick={() => setView('games')} className="mt-4 text-gray-600 font-semibold">Back to Games</button>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-100 min-h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">{t.foodSortGameTitle}</h2>
                <p className="text-lg font-bold text-blue-600">{t.score}: {score}</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-6">
                <div className="text-7xl mb-4">{currentFood.emoji}</div>
                <p className="text-2xl font-semibold text-gray-800">{currentFood.name}</p>
            </div>
            {feedback && (<div className={`mt-4 p-4 rounded-lg text-center ${feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}><p className="font-bold text-lg">{feedback.isCorrect ? t.correct : t.incorrect}</p><p className="text-sm">{feedback.info}</p></div>)}
            <div className="mt-6 grid grid-cols-2 gap-4">
                <button onClick={() => handleChoice('good')} className="bg-green-500 text-white font-bold py-4 rounded-lg shadow-md hover:bg-green-600 disabled:opacity-50" disabled={!!feedback}>{t.goodForKidneys}</button>
                <button onClick={() => handleChoice('bad')} className="bg-red-500 text-white font-bold py-4 rounded-lg shadow-md hover:bg-red-600 disabled:opacity-50" disabled={!!feedback}>{t.limitAvoid}</button>
            </div>
        </div>
    );
};

export default HealthyFoodSortGame;
