
import React from 'react';
import type { Language } from '../../types';

interface SettingsScreenProps {
    t: any;
    language: Language;
    setLanguage: (lang: Language) => void;
    onSignOut: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ t, language, setLanguage, onSignOut }) => {
    const languages = [{ code: 'en', name: 'English' }, { code: 'tw', name: 'Twi' }];
    return (
        <div>
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <h3 className="font-semibold text-gray-700 mb-3">{t.language}</h3>
                <div className="space-y-2">
                    {languages.map(lang => (
                        <button key={lang.code} onClick={() => setLanguage(lang.code as Language)} className={`w-full text-left p-3 rounded-md transition-colors ${language === lang.code ? 'bg-blue-500 text-white font-bold' : 'bg-gray-100 hover:bg-gray-200'}`}>
                            {lang.name}
                        </button>
                    ))}
                </div>
            </div>
             <div className="bg-white p-4 rounded-lg shadow-sm">
                <button onClick={onSignOut} className="w-full text-center p-3 rounded-md bg-red-100 text-red-700 font-bold hover:bg-red-200">{t.signOut}</button>
            </div>
        </div>
    );
};

export default SettingsScreen;
