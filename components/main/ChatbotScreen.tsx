import React, { useState, useEffect, useRef } from 'react';
import Icon from '../Icon';
import * as geminiService from '../../services/geminiService';
import type { Language } from '../../types';
import type { Chat } from '@google/genai';

interface ChatbotScreenProps {
    t: any;
    setView: (view: string) => void;
    language: Language;
}

interface ChatMessage {
    id: number;
    role: 'user' | 'model';
    parts: { text: string }[];
}

const ChatbotScreen: React.FC<ChatbotScreenProps> = ({ t, setView, language }) => {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [currentlyPlayingId, setCurrentlyPlayingId] = useState<number | null>(null);
    const [voiceError, setVoiceError] = useState('');
    const [chat, setChat] = useState<Chat | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null); // Using 'any' for SpeechRecognition to support webkit prefix

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [chatHistory]);

    useEffect(() => {
        setChat(geminiService.createChat());
    }, []);


    useEffect(() => {
        if (!('speechSynthesis' in window)) {
            console.log("Speech synthesis not supported.");
            return;
        }
        window.speechSynthesis.getVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = () => {
                window.speechSynthesis.getVoices();
            }
        }
    }, []);

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            window.speechSynthesis.cancel();
        };
    }, []);

    const playAudio = (text: string, messageId: number) => {
        if (!('speechSynthesis' in window)) {
            console.error("Speech synthesis not supported.");
            return;
        }

        if (currentlyPlayingId === messageId) {
            window.speechSynthesis.cancel();
            setCurrentlyPlayingId(null);
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        const voices = window.speechSynthesis.getVoices();
        
        // Improved voice selection logic
        if (language === 'tw') {
            const twiVoice = voices.find(v => v.lang.startsWith('ak-GH'));
            if (twiVoice) {
                utterance.voice = twiVoice;
            } else {
                console.warn("Twi (ak-GH) voice not found. Falling back to English.");
                // If Twi voice isn't available, fall back to a default English voice to prevent an error.
                utterance.lang = 'en-US';
            }
        } else {
            utterance.lang = 'en-US';
        }

        utterance.onstart = () => setCurrentlyPlayingId(messageId);
        utterance.onend = () => setCurrentlyPlayingId(null);
        utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
            // The 'interrupted' error is expected when the user stops playback or starts new audio.
            // We can safely ignore it to avoid cluttering the console with non-critical errors.
            if (e.error !== 'interrupted') {
                console.error(`Speech synthesis error: ${e.error}. Utterance text: "${text.substring(0, 50)}..."`);
            }
            setCurrentlyPlayingId(null);
        };

        setTimeout(() => {
            window.speechSynthesis.speak(utterance);
        }, 50);
    };

    const handleSend = async (textFromVoice: string | null = null) => {
        const textToSend = textFromVoice || input;
        if (textToSend.trim() === '' || !chat) return;

        const userMessage: ChatMessage = { id: Date.now(), role: "user", parts: [{ text: textToSend }] };
        setChatHistory(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const stream = await chat.sendMessageStream({ message: textToSend });
            setIsTyping(false);

            const messageId = Date.now() + 1;
            let modelResponseText = '';
            
            setChatHistory(prev => [...prev, { id: messageId, role: 'model', parts: [{ text: '' }] }]);

            for await (const chunk of stream) {
                modelResponseText += chunk.text;
                setChatHistory(prev => prev.map(msg => 
                    msg.id === messageId ? { ...msg, parts: [{ text: modelResponseText + '▌' }] } : msg
                ));
            }
            
            setChatHistory(prev => prev.map(msg => 
                msg.id === messageId ? { ...msg, parts: [{ text: modelResponseText }] } : msg
            ));

            playAudio(modelResponseText, messageId);
        } catch (error) {
            setIsTyping(false);
            console.error("Gemini chat call failed:", error);
            const message = error instanceof Error ? error.message : "An unknown error occurred.";
            const errorMessage: ChatMessage = { id: Date.now() + 1, role: "model", parts: [{ text: `Sorry, I'm having trouble connecting. ${message}` }] };
            setChatHistory(prev => [...prev, errorMessage]);
        }
    };

    const handleToggleListen = () => {
        if (isListening) {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setIsListening(false);
            return;
        }

        // FIX: Cast window to `any` to access the non-standard SpeechRecognition property which is not in the default TS DOM types.
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setVoiceError("Sorry, your browser doesn't support voice recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = language === 'tw' ? 'ak-GH' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

        recognition.onstart = () => { setIsListening(true); setVoiceError(''); };
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            handleSend(transcript);
        };
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            if (event.error === 'no-speech') setVoiceError(t.voiceErrorNoSpeech);
            else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') setVoiceError(t.voiceErrorNotAllowed);
            else setVoiceError(t.voiceError);
            setIsListening(false);
        };
        recognition.onend = () => { setIsListening(false); recognitionRef.current = null; };
        recognition.start();
    };

    return (
        <div className="p-4 bg-gray-50 h-full flex flex-col">
            {isListening && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-50 text-white">
                    <Icon path="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6zM10.5 11.25a1.5 1.5 0 113 0v6a1.5 1.5 0 11-3 0v-6zM12 3a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3.75A.75.75 0 0112 3z" className="w-16 h-16 mb-4 animate-pulse"/>
                    <h3 className="text-2xl font-bold">{t.listening}</h3>
                    <p className="text-lg">{t.tapToStop}</p>
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                 <button onClick={() => setView('consult')}>
                    <Icon path="M15.75 19.5L8.25 12l7.5-7.5" className="w-6 h-6"/>
                </button>
                <h2 className="text-2xl font-bold text-gray-800 text-center">{t.aiChatbot}</h2>
                <div className="w-6"></div>
            </div>
            
            <p className="text-xs text-center text-gray-600 bg-gray-200 p-2 rounded-md mb-4">{t.aiDisclaimer}</p>
            {voiceError && <p className="text-red-500 text-center mb-2">{voiceError}</p>}

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {chatHistory.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white shadow-sm text-gray-800'}`}>
                            {msg.parts[0].text}
                            {msg.role === 'model' && (
                                <div className="mt-2 border-t pt-2">
                                    <button onClick={() => playAudio(msg.parts[0].text, msg.id)} className={`flex items-center text-xs font-semibold ${currentlyPlayingId === msg.id ? 'text-red-600' : 'text-blue-600 hover:text-blue-800'}`}>
                                        <Icon path={currentlyPlayingId === msg.id ? "M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25-2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" : "M5.25 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L8.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z"} className="w-4 h-4 mr-1" />
                                        {currentlyPlayingId === msg.id ? 'Stop' : t.playAudio}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                     <div className="flex justify-start">
                        <div className="p-3 rounded-lg bg-white shadow-sm">
                            <div className="flex space-x-1">
                                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-4 flex items-center">
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder={t.askMeAnything} className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <button onClick={handleToggleListen} className={`p-3 ${isListening ? 'bg-red-500' : 'bg-gray-600'} text-white hover:bg-gray-700`}>
                    <Icon path="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6zM10.5 11.25a1.5 1.5 0 113 0v6a1.5 1.5 0 11-3 0v-6zM12 3a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3.75A.75.75 0 0112 3z" className="w-6 h-6"/>
                </button>
                <button onClick={() => handleSend()} className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600">
                    <Icon path="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" className="w-6 h-6"/>
                </button>
            </div>
        </div>
    );
};

export default ChatbotScreen;