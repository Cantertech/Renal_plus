
import React from 'react';
import { mockDoctors } from '../../constants';
import type { Doctor } from '../../types';

interface DoctorListScreenProps {
    t: any;
    setView: (view: string) => void;
    setSelectedDoctor: (doctor: Doctor) => void;
}

const DoctorListScreen: React.FC<DoctorListScreenProps> = ({ t, setView, setSelectedDoctor }) => {
    const handleSelectDoctor = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setView('booking');
    };

    return (
        <div className="p-4 bg-gray-50 min-h-full">
            <h2 className="text-2xl font-bold text-gray-800 text-center">{t.availableNephrologists}</h2>
            <p className="text-gray-600 text-center mb-6">{t.findSpecialistDesc}</p>
            <div className="space-y-4">
                {mockDoctors.map(doctor => (
                    <div key={doctor.id} className="bg-white p-4 rounded-lg shadow-sm flex items-start space-x-4">
                        <img src={doctor.image} alt={`${t.dr} ${doctor.name}`} className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800">{t.dr} {doctor.name}</h3>
                            <p className="text-blue-600 font-semibold">{doctor.specialty}</p>
                            <p className="text-sm text-gray-500 mt-1">{t.experience}: {doctor.experience}</p>
                            <p className="text-sm text-gray-500">{t.availability}: {doctor.availability}</p>
                             <div className="flex justify-between items-center mt-2">
                                <p className="text-green-600 font-bold">{doctor.fee}</p>
                                <button onClick={() => handleSelectDoctor(doctor)} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 text-sm">{t.bookNow}</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => setView('consult')} className="mt-8 w-full text-blue-500 font-semibold py-3">{t.backToConsult}</button>
        </div>
    );
};

export default DoctorListScreen;
