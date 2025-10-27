
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
        { name: 'home', label: t.home, icon: "M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" },
        { name: 'wellness', label: t.wellness, icon: "M12.012 2.25a.75.75 0 01.75.75v.006a14.25 14.25 0 010 18.019v.005a.75.75 0 01-1.5 0v-.005a12.75 12.75 0 000-16.02V3a.75.75 0 01.75-.75zM16.5 4.503a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM7.5 18.497a.75.75 0 010-1.06l1.06-1.06a.75.75 0 111.06 1.06l-1.06 1.06a.75.75 0 01-1.06 0z" },
        { name: 'consult', label: t.consult, icon: "M8.25 4.5a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM14.25 8.625a3.375 3.375 0 00-3.375-3.375H12A3.375 3.375 0 008.625 8.625v1.687c0 .414.336.75.75.75h3.75a.75.75 0 00.75-.75v-1.687zM5.25 12.375a3.75 3.75 0 013.75-3.75h.75a3.75 3.75 0 013.75 3.75v.938c0 .414.336.75.75.75h.75a.75.75 0 00.75-.75v-.938a5.25 5.25 0 00-5.25-5.25h-.75a5.25 5.25 0 00-5.25 5.25v.938c0 .414.336.75.75.75h.75a.75.75 0 00.75-.75v-.938z" },
        { name: 'games', label: t.games, icon: "M10.894 2.106a.75.75 0 01.812 1.212l-1.832 2.442a.75.75 0 01-1.212-.812L10.5 2.274a.75.75 0 01.394-.168zM5.25 7.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 015.25 7.5zM7.058 14.942a.75.75 0 011.212-.812l2.442-1.832a.75.75 0 01.812 1.212l-2.442 1.832a.75.75 0 01-1.212-.812zM15.75 7.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM14.942 16.942a.75.75 0 01-.812-1.212l1.832-2.442a.75.75 0 011.212.812l-1.832 2.442a.75.75 0 01-.4-.168zM18.75 11.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM16.942 5.058a.75.75 0 01.812 1.212l-2.442 1.832a.75.75 0 01-1.212-.812l2.442-1.832a.75.75 0 01.4-.168zM4.5 11.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 014.5 11.25z" },
        { name: 'profile', label: t.profile, icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A1.75 1.75 0 0117.749 22H6.251a1.75 1.75 0 01-1.75-1.882z" },
    ];

    const isGameView = view === 'kidneyRunnerGame' || view === 'hydrationHeroGame';

    return (
        <div className="font-sans antialiased h-screen w-screen bg-gray-100 flex flex-col max-w-md mx-auto shadow-2xl">
            <main className="flex-1 overflow-y-auto relative">
                {user ? renderMainApp() : renderAuthView()}
            </main>
            {user && !isGameView && (
              <nav className="flex justify-around items-center bg-white border-t border-gray-200 shadow-inner h-16">
                  {navItems.map(item => (
                      <button key={item.name} onClick={() => setView(item.name)} className={`flex flex-col items-center justify-center w-full h-full text-sm transition-colors ${view === item.name ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}>
                          <Icon path={item.icon} className="w-6 h-6 mb-1" />
                          <span>{item.label}</span>
                      </button>
                  ))}
              </nav>
            )}
        </div>
    );
}

export default App;
