import React, { useState } from 'react';

interface SignUpScreenProps {
  t: any;
  setView: (view: string) => void;
  onSignUp: (formData: any) => Promise<any>;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ t, setView, onSignUp }) => {
    const [formData, setFormData] = useState({ name: '', age: '', gender: 'Male', email: '', password: '', conditions: [] as string[] });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleConditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const conditions = checked ? [...prev.conditions, value] : prev.conditions.filter(c => c !== value);
            return { ...prev, conditions };
        });
    };

    const handleSignUp = async () => {
        if (!formData.email || !formData.password || !formData.name || !formData.age) {
            setError('Please fill in all required fields.');
            return;
        }
        try {
            await onSignUp(formData);
        } catch(err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-full overflow-y-auto">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">{t.signUp}</h2>
            <div className="space-y-4">
                <input type="text" name="name" placeholder={t.name} value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg"/>
                <input type="number" name="age" placeholder={t.age} value={formData.age} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg"/>
                <div>
                    <label htmlFor="gender-select" className="font-semibold text-gray-700">{t.gender}</label>
                    <select id="gender-select" name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 mt-1">
                        <option value="Male">{t.male}</option>
                        <option value="Female">{t.female}</option>
                        <option value="Other">{t.other}</option>
                    </select>
                </div>
                <input type="email" name="email" placeholder={t.email} value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg"/>
                <input type="password" name="password" placeholder={t.password} value={formData.password} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg"/>
                <div>
                    <label className="font-semibold text-gray-700">{t.preExistingConditions}</label>
                    <div className="flex items-center space-x-4 mt-2">
                        <label className="flex items-center text-gray-700"><input type="checkbox" value="Hypertension" onChange={handleConditionChange} className="mr-2"/> {t.hypertension}</label>
                        <label className="flex items-center text-gray-700"><input type="checkbox" value="Diabetes" onChange={handleConditionChange} className="mr-2"/> {t.diabetes}</label>
                    </div>
                </div>
            </div>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            <button onClick={handleSignUp} className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg shadow-lg">{t.signUp}</button>
            <p className="text-center mt-4">
                {t.alreadyHaveAccount} <button onClick={() => setView('login')} className="text-blue-500 font-semibold">{t.login}</button>
            </p>
        </div>
    );
};

export default SignUpScreen;