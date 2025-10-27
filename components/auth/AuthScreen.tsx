import React from 'react';
import KidneyIcon from '../KidneyIcon';

interface AuthScreenProps {
  t: any;
  setView: (view: string) => void;
  onGuestLogin: () => void;
  isOnline: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ t, setView, onGuestLogin, isOnline }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50">
        <KidneyIcon />
        <h1 className="text-3xl font-bold text-gray-800 mt-4">{t.welcome}</h1>
        <p className="text-gray-600 mt-2 mb-12 max-w-sm">{t.welcomeSubtitle}</p>
        <div className="w-full max-w-sm space-y-4">
            <button 
                onClick={() => setView('login')} 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
            >
                {t.login}
            </button>
            <button 
                onClick={() => setView('signup')} 
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
            >
                {t.signUp}
            </button>
            <button onClick={onGuestLogin} className="w-full text-gray-600 font-semibold py-2">{t.continueAsGuest}</button>
            {!isOnline && <p className="text-sm text-gray-500 mt-2">Login/Sign up require a connection.</p>}
        </div>
    </div>
);

export default AuthScreen;