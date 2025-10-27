
import React, { useState, useEffect } from 'react';
import HistoryScreen from './HistoryScreen';
import SettingsScreen from './SettingsScreen';
import type { TestResult, Language, AppServices, UserProfile } from '../../types';

interface ProfileScreenProps extends AppServices {
    t: any;
    language: Language;
    setLanguage: (lang: Language) => void;
    onSignOut: () => void;
    history: TestResult[];
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ t, language, setLanguage, onSignOut, history, user, appId }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [activeTab, setActiveTab] = useState('history');

    useEffect(() => {
        if (user && !user.isAnonymous) {
            const storedProfile = localStorage.getItem(`renal_plus_profile_${user.uid}`);
            if (storedProfile) {
                try {
                    setProfile(JSON.parse(storedProfile));
                } catch (e) {
                    setProfile(null);
                }
            } else {
                setProfile(null);
            }
        } else {
            setProfile(null);
        }
    }, [user]);

    return (
      <div className="p-4 bg-gray-50 min-h-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.myProfile}</h2>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <h3 className="font-bold text-lg">{profile?.name || 'Guest User'}</h3>
            <p className="text-gray-600 text-sm">{user?.isAnonymous ? 'Anonymous User' : user?.email || 'No email'}</p>
            {profile && <p className="text-sm text-gray-500">{profile.age} years old, {profile.gender}</p>}
        </div>

        <div className="flex border-b mb-4">
            <button onClick={() => setActiveTab('history')} className={`py-2 px-4 font-semibold ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>{t.testHistory}</button>
            <button onClick={() => setActiveTab('settings')} className={`py-2 px-4 font-semibold ${activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>{t.settings}</button>
        </div>

        {activeTab === 'history' ? (
            <HistoryScreen t={t} history={history} />
        ) : (
            <SettingsScreen t={t} language={language} setLanguage={setLanguage} onSignOut={onSignOut} />
        )}
      </div>
    );
};

export default ProfileScreen;
