import React, { useState, useEffect, useContext } from 'react';
import { BookingContext } from '../../components/BookingHandler';
import { useRouter } from 'next/router';

const Specialist = () => {
  const router = useRouter();
  const { bookingData, setBookingData } = useContext(BookingContext);
  const [specialists, setSpecialists] = useState([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Функция для загрузки списка специалистов
  const fetchSpecialists = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/specialists');
      if (!response.ok) {
        throw new Error('Failed to fetch specialists');
      }
      const data = await response.json();
      setSpecialists(data);
    } catch (error) {
      console.error('Error fetching specialists:', error);
      setErrorMessage(`Error fetching specialists: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchSpecialists();
  }, []);

  // Функция для обработки выбора специалиста
  const handleSelectSpecialist = (specialist) => {
    setSelectedSpecialist(specialist);
    setBookingData({ ...bookingData, specialistId: specialist.id });
    console.log(selectedSpecialist);
    setErrorMessage('');
  };

  // Функция для обработки перехода и получения информации о специалисте
  const handleProceed = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/specialists/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch specialist details');
      }
      const data = await response.json();
      console.log('Services of Specialist', id, ':', data.services);
      router.push('/services');
    } catch (error) {
      console.error('Error fetching specialist details:', error);
      setErrorMessage(`Error fetching specialist details: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {errorMessage && <div className="bg-red-500 text-white p-2 mb-4">{errorMessage}</div>}
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
      {selectedSpecialist && (
        <button
          className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleProceed(selectedSpecialist.id)}
        >
          Choose Specialist
        </button>
      )}
    </div>
  );
};

export default Specialist;
