
import React from 'react';

interface GamesScreenProps {
    t: any;
    setView: (view: string) => void;
}

const GamesScreen: React.FC<GamesScreenProps> = ({ t, setView }) => {
    return (
        <div className="p-4 bg-gray-50 min-h-full">
            <h2 className="text-2xl font-bold text-gray-800 text-center">{t.gameCenter}</h2>
            <p className="text-gray-600 text-center mb-6">{t.gameCenterSubtitle}</p>
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-bold text-blue-600 text-lg">{t.foodSortGameTitle}</h3>
                    <p className="text-gray-600 mt-1 mb-4">{t.foodSortGameDesc}</p>
                    <button onClick={() => setView('foodSortGame')} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">{t.playNow}</button>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-bold text-blue-600 text-lg">{t.kidneyRunnerGameTitle}</h3>
                    <p className="text-gray-600 mt-1 mb-4">{t.kidneyRunnerGameDesc}</p>
                    <button onClick={() => setView('kidneyRunnerGame')} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">{t.playNow}</button>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-bold text-blue-600 text-lg">{t.hydrationHeroGameTitle}</h3>
                    <p className="text-gray-600 mt-1 mb-4">{t.hydrationHeroGameDesc}</p>
                    <button onClick={() => setView('hydrationHeroGame')} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">{t.playNow}</button>
                </div>
            </div>
        </div>
    );
};

export default GamesScreen;
