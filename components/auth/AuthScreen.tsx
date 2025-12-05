import React from 'react';
import logo from '../assets/logo.png';

interface AuthScreenProps {
    t: any;
    setView: (view: string) => void;
    onGuestLogin: () => void;
    isOnline: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ t, setView, onGuestLogin, isOnline }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="bg-white p-4 rounded-3xl shadow-sm mb-6">
            <img src={logo} alt="Renal Care Logo" className="w-24 h-24 object-contain" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t.welcome}</h1>
        <p className="text-gray-500 mt-3 mb-12 max-w-xs leading-relaxed">{t.welcomeSubtitle}</p>

        <div className="w-full max-w-sm space-y-4">
            <button
                onClick={() => setView('login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-blue-200 shadow-xl transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
                {t.login}
            </button>
            <button
                onClick={() => setView('signup')}
                className="w-full bg-white border border-gray-200 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-semibold py-4 px-6 rounded-2xl shadow-sm hover:shadow-md transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
                {t.signUp}
            </button>
            <button onClick={onGuestLogin} className="w-full text-gray-500 hover:text-gray-800 font-medium py-3 transition-colors">{t.continueAsGuest}</button>
            {!isOnline && <p className="text-xs text-red-400 mt-2 bg-red-50 py-1 px-3 rounded-full">Login/Sign up require a connection.</p>}
        </div>
    </div>
);

export default AuthScreen;