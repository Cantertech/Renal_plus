
import React, { useState } from 'react';
import type { Doctor, BookingDetails } from '../../types';

interface BookingScreenProps {
    t: any;
    setView: (view: string) => void;
    doctor: Doctor | null;
    setBookingDetails: (details: BookingDetails) => void;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ t, setView, doctor, setBookingDetails }) => {
    const [selectedDate, setSelectedDate] = useState('2025-10-24');
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const timeSlots = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"];

    if (!doctor) return null;

    const handleConfirmBooking = () => {
        if (!selectedTime) {
            console.error("Please select a time slot."); 
            return;
        }
        
        setBookingDetails({
            doctorName: doctor.name,
            date: selectedDate,
            time: selectedTime,
        });
        setView('confirmation');
    };

    return (
        <div className="p-4 bg-gray-50 min-h-full">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">{t.bookAppointment}</h2>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <img src={doctor.image} alt={`${t.dr} ${doctor.name}`} className="w-24 h-24 rounded-full mx-auto border-4 border-blue-200" />
                <h3 className="font-bold text-xl text-gray-800 mt-2">{t.dr} {doctor.name}</h3>
                <p className="text-gray-600">{doctor.specialty}</p>
                <p className="text-lg text-green-600 font-bold mt-1">{doctor.fee}</p>
            </div>
            <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-gray-700 mb-3">{t.selectDateTime}</h3>
                <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
                <div className="grid grid-cols-2 gap-3 mt-4">
                    {timeSlots.map(time => (
                        <button 
                            key={time} 
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 rounded-md text-center font-semibold ${selectedTime === time ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>
             <button 
                onClick={handleConfirmBooking} 
                disabled={!selectedTime}
                className="mt-6 w-full bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
                {t.confirmBooking}
            </button>
        </div>
    );
};

export default BookingScreen;
