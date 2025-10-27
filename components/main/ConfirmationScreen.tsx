
import React from 'react';
import type { BookingDetails } from '../../types';

interface ConfirmationScreenProps {
    t: any;
    setView: (view: string) => void;
    bookingDetails: BookingDetails | null;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ t, setView, bookingDetails }) => {
    if (!bookingDetails) return null;

    return (
        <div className="p-8 bg-gray-50 min-h-full flex flex-col items-center justify-center text-center">
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
             </div>
            <h2 className="text-2xl font-bold text-gray-800">{t.appointmentConfirmed}</h2>
            <p className="text-gray-600 mt-2">
                {t.appointmentDetails
                    .replace('{doctorName}', bookingDetails.doctorName)
                    .replace('{date}', new Date(bookingDetails.date).toDateString())
                    .replace('{time}', bookingDetails.time)
                }
            </p>
            <button onClick={() => setView('consult')} className="mt-8 w-full bg-blue-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-600">{t.backToConsult}</button>
        </div>
    );
};

export default ConfirmationScreen;
