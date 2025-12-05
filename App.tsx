
import React, { useState, useEffect } from 'react';
import { translations } from './constants';
import type { TestResult, BookingDetails, FoodData, AIReport, Language, UserProfile, Vitals, DummyUser } from './types';
import * as geminiService from './services/geminiService';

import Icon from './components/Icon';
import AuthScreen from './components/auth/AuthScreen';
import LoginScreen from './components/auth/LoginScreen';
import SignUpScreen from './components/auth/SignUpScreen';
import HomeScreen from './components/main/HomeScreen';
import ScanScreen from './components/main/ScanScreen';
import ResultScreen from './components/main/ResultScreen';
import WellnessScreen from './components/wellness/WellnessScreen';
import ConsultScreen from './components/main/ConsultScreen';
import DoctorListScreen from './components/main/DoctorListScreen';
import ChatbotScreen from './components/main/ChatbotScreen';
import BookingScreen from './components/main/BookingScreen';
import ConfirmationScreen from './components/main/ConfirmationScreen';
import GamesScreen from './components/games/GamesScreen';
import HealthyFoodSortGame from './components/games/HealthyFoodSortGame';
import KidneyRunnerGame from './components/games/KidneyRunnerGame';
import HydrationHeroGame from './components/games/HydrationHeroGame';
import ProfileScreen from './components/profile/ProfileScreen';
import FoodScanScreen from './components/main/FoodScanScreen';
import FoodResultScreen from './components/main/FoodResultScreen';
import AIReportScreen from './components/main/AIReportScreen';

function App() {
    const [view, setView] = useState('home');
    const [authView, setAuthView] = useState('auth');
    const [language, setLanguageState] = useState<Language>('en');
    const [history, setHistory] = useState<TestResult[]>([]);
    const [recentResult, setRecentResult] = useState<TestResult | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [currentFoodData, setCurrentFoodData] = useState<FoodData | null>(null);
    const [aiReport, setAiReport] = useState<AIReport | null>(null);
    const [aiReportError, setAiReportError] = useState('');

    const [user, setUser] = useState<DummyUser | null | undefined>(undefined);
    const appId = 'renal-plus-default';

    // Initialize user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('renal_plus_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, []);

    // Load language from localStorage
    useEffect(() => {
        const storedLang = localStorage.getItem('renal_plus_language');
        if (storedLang) {
            setLanguageState(storedLang as Language);
        }
    }, []);

    // Load history from localStorage
    useEffect(() => {
        if (user) {
            const storedHistory = localStorage.getItem(`renal_plus_history_${user.uid}`);
            if (storedHistory) {
                try {
                    setHistory(JSON.parse(storedHistory));
                } catch (e) {
                    setHistory([]);
                }
            } else {
                setHistory([]);
            }
        } else {
            setHistory([]);
        }
    }, [user]);

    const setLanguage = (langCode: Language) => {
        setLanguageState(langCode);
        localStorage.setItem('renal_plus_language', langCode);
    };

    const addResult = (result: Omit<TestResult, 'id' | 'timestamp'> & { timestamp?: string }) => {
        const resultWithTimestamp = { ...result, timestamp: new Date().toISOString() };
        setRecentResult(resultWithTimestamp);
        const newHistory = [resultWithTimestamp, ...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setHistory(newHistory);

        if (user) {
            localStorage.setItem(`renal_plus_history_${user.uid}`, JSON.stringify(newHistory));
        }
    };

    const handleFoodAnalyzed = (foodData: FoodData) => {
        setCurrentFoodData(foodData);
    };

    const generateAIReport = async () => {
        if (!user) return;
        setView('aiReport');
        setAiReport(null);
        setAiReportError('');

        try {
            // Get dummy vitals from localStorage
            const storedVitals = localStorage.getItem(`renal_plus_vitals_${user.uid}`);
            const latestVitals: Vitals | null = storedVitals ? JSON.parse(storedVitals) : null;

            // Get latest test from history
            const latestTest: TestResult | null = history.length > 0 ? history[0] : null;

            if (!latestVitals || !latestTest) {
                const missingData = [];
                if (!latestVitals) missingData.push("vitals");
                if (!latestTest) missingData.push("a test result");
                const errorMessage = t.notEnoughDataError.replace('{missingData}', missingData.join(' and '));
                setAiReportError(errorMessage);
                return;
            }

            // Get dummy user profile
            let userProfile: UserProfile | null = null;
            if (!user.isAnonymous) {
                const storedProfile = localStorage.getItem(`renal_plus_profile_${user.uid}`);
                if (storedProfile) {
                    userProfile = JSON.parse(storedProfile);
                }
            }

            const report = await geminiService.generateHealthReport(latestTest, latestVitals, userProfile);
            setAiReport(report);

        } catch (error) {
            console.error("Error generating AI report:", error);
            const message = error instanceof Error ? error.message : "An unknown error occurred.";
            setAiReportError(`An error occurred while generating the report: ${message}`);
        }
    };

    const handleGuestLogin = () => {
        const guestUser: DummyUser = {
            uid: `guest_${Date.now()}`,
            isAnonymous: true
        };
        setUser(guestUser);
        localStorage.setItem('renal_plus_user', JSON.stringify(guestUser));
    };

    const handleLogin = (email: string, password: string) => {
        // Dummy login - check localStorage for users
        const storedUsers = localStorage.getItem('renal_plus_users');
        const users = storedUsers ? JSON.parse(storedUsers) : {};

        if (users[email] && users[email].password === password) {
            const userData: DummyUser = {
                uid: users[email].uid,
                email: email,
                displayName: users[email].name,
                isAnonymous: false
            };
            setUser(userData);
            localStorage.setItem('renal_plus_user', JSON.stringify(userData));
            return Promise.resolve();
        }

        return Promise.reject(new Error('Invalid email or password'));
    };

    const handleSignUp = async (formData: any) => {
        const storedUsers = localStorage.getItem('renal_plus_users');
        const users = storedUsers ? JSON.parse(storedUsers) : {};

        if (users[formData.email]) {
            throw new Error('User already exists');
        }

        const uid = `user_${Date.now()}`;
        users[formData.email] = {
            uid,
            name: formData.name,
            password: formData.password,
            age: formData.age,
            gender: formData.gender,
            conditions: formData.conditions
        };
        localStorage.setItem('renal_plus_users', JSON.stringify(users));

        const userProfile: UserProfile = {
            uid: uid,
            name: formData.name,
            age: formData.age || null,
            gender: formData.gender,
            conditions: formData.conditions,
            createdAt: new Date().toISOString(),
        };
        localStorage.setItem(`renal_plus_profile_${uid}`, JSON.stringify(userProfile));

        const newUser: DummyUser = {
            uid: uid,
            email: formData.email,
            displayName: formData.name,
            isAnonymous: false
        };
        setUser(newUser);
        localStorage.setItem('renal_plus_user', JSON.stringify(newUser));
    };

    const handleSignOut = () => {
        setUser(null);
        localStorage.removeItem('renal_plus_user');
    };

    const t = translations[language] || translations.en;

    if (user === undefined) {
        return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
    }

    const renderAuthView = () => {
        switch (authView) {
            case 'login': return <LoginScreen t={t} setView={setAuthView} onLogin={handleLogin} />;
            case 'signup': return <SignUpScreen t={t} setView={setAuthView} onSignUp={handleSignUp} />;
            case 'auth': default: return <AuthScreen t={t} setView={setAuthView} onGuestLogin={handleGuestLogin} isOnline={true} />;
        }
    };

    const appServices = { user, appId };

    const renderMainApp = () => {
        switch (view) {
            case 'scan': return <ScanScreen t={t} setView={setView} addResult={addResult} />;
            case 'result': return <ResultScreen t={t} setView={setView} recentResult={recentResult} />;
            case 'wellness': return <WellnessScreen t={t} {...appServices} />;
            case 'consult': return <ConsultScreen t={t} setView={setView} />;
            case 'doctorList': return <DoctorListScreen t={t} setView={setView} setSelectedDoctor={setSelectedDoctor} />;
            case 'chatbot': return <ChatbotScreen t={t} setView={setView} language={language} />;
            case 'booking': return <BookingScreen t={t} setView={setView} doctor={selectedDoctor} setBookingDetails={setBookingDetails} />;
            case 'confirmation': return <ConfirmationScreen t={t} setView={setView} bookingDetails={bookingDetails} />;
            case 'games': return <GamesScreen t={t} setView={setView} />;
            case 'foodSortGame': return <HealthyFoodSortGame t={t} setView={setView} />;
            case 'kidneyRunnerGame': return <KidneyRunnerGame t={t} setView={setView} />;
            case 'hydrationHeroGame': return <HydrationHeroGame t={t} setView={setView} />;
            case 'profile': return <ProfileScreen t={t} language={language} setLanguage={setLanguage} onSignOut={handleSignOut} history={history} {...appServices} />;
            case 'foodScan': return <FoodScanScreen t={t} setView={setView} onFoodAnalyzed={handleFoodAnalyzed} {...appServices} />;
            case 'foodResult': return <FoodResultScreen t={t} setView={setView} foodData={currentFoodData} />;
            case 'aiReport': return <AIReportScreen t={t} setView={setView} report={aiReport} error={aiReportError} />;
            case 'home': default: return <HomeScreen t={t} setView={setView} setRecentResult={setRecentResult} onGenerateReport={generateAIReport} />;
        }
    };

    const navItems = [
        { name: 'home', label: t.home, icon: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" },
        { name: 'wellness', label: t.wellness, icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
        { name: 'consult', label: t.consult, icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" },
        { name: 'games', label: t.games, icon: "M14.6 9a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 14.6 9ZM13.85 13.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75ZM9.35 13.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75ZM8.6 9a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8.6 9ZM11.6 6a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 11.6 6ZM11.6 16.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75Z" },
        { name: 'profile', label: t.profile, icon: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" },
    ];

    const isGameView = view === 'kidneyRunnerGame' || view === 'hydrationHeroGame';

    return (
        <div className="font-sans antialiased h-screen w-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl sm:rounded-3xl overflow-hidden border border-gray-200 my-0 sm:my-4">
            <main className="flex-1 overflow-y-auto relative bg-gray-50 scrollbar-hide">
                {user ? renderMainApp() : renderAuthView()}
            </main>
            {user && !isGameView && (
                <nav className="flex justify-around items-center bg-white/90 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] h-20 pb-2 rounded-t-2xl">
                    {navItems.map(item => {
                        const isActive = view === item.name;
                        return (
                            <button
                                key={item.name}
                                onClick={() => setView(item.name)}
                                className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? 'text-blue-600 scale-105' : 'text-gray-400 hover:text-blue-400'}`}
                            >
                                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-blue-50' : 'bg-transparent'}`}>
                                    <Icon path={item.icon} className={`w-6 h-6 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} />
                                </div>
                                <span className={`text-[10px] font-medium mt-1 ${isActive ? 'opacity-100' : 'opacity-70'}`}>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            )}
        </div>
    );
}

export default App;
