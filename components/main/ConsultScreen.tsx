
import React from 'react';
import Icon from '../Icon';

interface ConsultScreenProps {
    t: any;
    setView: (view: string) => void;
}

const ConsultScreen: React.FC<ConsultScreenProps> = ({ t, setView }) => {
    return (
         <div className="p-4 bg-gray-50 min-h-full">
            <h2 className="text-2xl font-bold text-gray-800 text-center">{t.consult}</h2>
            <p className="text-gray-600 text-center mb-6">Get help from our AI or a certified doctor.</p>
            <div className="space-y-4">
                 <button onClick={() => setView('chatbot')} className="w-full bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
                    <Icon path="M12 20.25c.966 0 1.898.19 2.774.534A8.25 8.25 0 0020.25 13.5V10.5a8.25 8.25 0 00-4.06-7.22.75.75 0 00-.916.32L14.25 5.25a.75.75 0 00.32.916 6.75 6.75 0 012.55 5.45V13.5a6.75 6.75 0 01-5.83 6.71.75.75 0 00-.32.916l1.026 1.026a.75.75 0 00.916.32A8.25 8.25 0 0012 20.25zM12 4.75A1.5 1.5 0 0113.5 6.25v.75a1.5 1.5 0 01-3 0v-.75A1.5 1.5 0 0112 4.75zM10.125 10.125a1.5 1.5 0 112.25 2.25 1.5 1.5 0 01-2.25-2.25zM12 15a1.5 1.5 0 011.5 1.5v.75a1.5 1.5 0 01-3 0v-.75A1.5 1.5 0 0112 15zM4.113 11.03a8.25 8.25 0 000 4.94 5.513 5.513 0 003.5 5.013.75.75 0 00.6-.017l1.72-1.032a.75.75 0 00.14-.092 6.75 6.75 0 01-4.22-4.57 6.75 6.75 0 01.002-4.714.75.75 0 00-.14-.092L4.71 4.54A.75.75 0 004.11 4.52 5.513 5.513 0 00.6 9.533a8.25 8.25 0 003.513 1.497z" className="w-12 h-12 text-purple-500"/>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">{t.chatWithAI}</h3>
                        <p className="text-gray-600 text-sm text-left">{t.chatWithAIDesc}</p>
                    </div>
                </button>
                 <button onClick={() => setView('doctorList')} className="w-full bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
                     <Icon path="M8.25 4.5a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM14.25 8.625a3.375 3.375 0 00-3.375-3.375H12A3.375 3.375 0 008.625 8.625v1.687c0 .414.336.75.75.75h3.75a.75.75 0 00.75-.75v-1.687zM5.25 12.375a3.75 3.75 0 013.75-3.75h.75a3.75 3.75 0 013.75 3.75v.938c0 .414.336.75.75.75h.75a.75.75 0 00.75-.75v-.938a5.25 5.25 0 00-5.25-5.25h-.75a5.25 5.25 0 00-5.25 5.25v.938c0 .414.336.75.75.75h.75a.75.75 0 00.75-.75v-.938z" className="w-12 h-12 text-blue-500"/>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">{t.bookDoctor}</h3>
                        <p className="text-gray-600 text-sm text-left">{t.bookDoctorDesc}</p>
                    </div>
                </button>
            </div>
         </div>
    );
};

export default ConsultScreen;
