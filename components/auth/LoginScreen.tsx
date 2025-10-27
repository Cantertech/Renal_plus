
import React, { useState } from 'react';

interface LoginScreenProps {
  t: any;
  setView: (view: string) => void;
  onLogin: (email: string, password: string) => Promise<any>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ t, setView, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        try {
            await onLogin(email, password);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">{t.login}</h2>
            <div className="space-y-4">
                <input type="email" placeholder={t.email} value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <input type="password" placeholder={t.password} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            <button onClick={handleLogin} className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg">{t.login}</button>
            <p className="text-center mt-4">
                {t.dontHaveAccount} <button onClick={() => setView('signup')} className="text-blue-500 font-semibold">{t.signUp}</button>
            </p>
        </div>
    );
};

export default LoginScreen;
