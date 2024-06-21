import React, { useState, useEffect, useContext } from 'react';
import { BookingContext } from '../../components/BookingHandler';
import { useRouter } from 'next/router';

const SpecialistPage = () => {
  const router = useRouter();
  const { bookingData, setBookingData } = useContext(BookingContext);
  const [specialists, setSpecialists] = useState([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/specialists');
        if (response.ok) {
          const data = await response.json();
          setSpecialists(data); // Устанавливаем полученные данные в состояние
        } else {
          throw new Error('Failed to fetch specialists');
        }
      } catch (error) {
        console.error('Error fetching specialists:', error);
        setErrorMessage('Failed to fetch specialists');
      }
    };

    fetchSpecialists();
  }, []);

  const handleSelectSpecialist = (specialist) => {
    setSelectedSpecialist(specialist);
    setBookingData({ ...bookingData, specialist: specialist.name });
    setErrorMessage('');
  };
  

  const handleProceed = () => {
    if (selectedSpecialist) {
      router.push('/services');
    } else {
      setErrorMessage('Please select a specialist first');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {errorMessage && (
        <div className="bg-red-500 text-white p-2 mb-4">{errorMessage}</div>
      )}

      <div className="flex flex-wrap justify-center gap-6">
        {specialists.map((specialist) => (
          <div
            key={specialist.id}
            className={`relative rounded-lg shadow-lg p-4 bg-gray-700 w-[300px] h-[300px] cursor-pointer ${selectedSpecialist === specialist ? 'border-2 border-gray-500' : ''}`}
            onClick={() => handleSelectSpecialist(specialist)}
          >
            <img
              src={`http://localhost:3001/${specialist.photo}`}
              alt={specialist.name}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gray-900 bg-opacity-75 text-white text-center">
              {specialist.name}
            </div>
          </div>
        ))}
      </div>

      <button
        className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleProceed}
      >
        Choose Specialist
      </button>
    </div>
  );
};

export default SpecialistPage;
