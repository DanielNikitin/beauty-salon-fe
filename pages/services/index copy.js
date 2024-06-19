import React, { useState, useContext } from 'react';
import { BookingContext } from '../../components/BookingHandler';
import { useRouter } from 'next/router';

const Services = () => {
  const router = useRouter();
  const { bookingData, setBookingData } = useContext(BookingContext);

  const [selectedServices, setSelectedServices] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleServiceClick = (service) => {
    if (selectedServices === service) {
      setSelectedServices(null);
      setBookingData({ ...bookingData, service: null });
    } else {
      setSelectedServices(service);
      setBookingData({ ...bookingData, service: `Service ${service}` });
    }
  };

  const handleBookNowClick = () => {
    if (selectedServices !== null) {
      console.log(`Service confirmed for ${selectedServices}`);
      setErrorMessage('');
      // switch to booking page
      router.push('/booking');
    } else {
      setErrorMessage('Please select at least one service');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">

      {errorMessage && (
        <div className="bg-red-500 text-white p-2 mb-4">{errorMessage}</div>
      )}
      
      <h1 className="text-3xl font-bold mb-4">Choose Services</h1>

      <div className="flex flex-col space-y-4">
        <div
          className={`p-4 rounded-lg cursor-pointer ${selectedServices === 1 ? 'bg-gray-700' : ''}`}
          onClick={() => handleServiceClick(1)}
        >
          {/* Наименование и другие детали первой карточки */}
          <h2 className="text-white text-xl font-bold">Service 1</h2>
        </div>
        <div
          className={`p-4 rounded-lg cursor-pointer ${selectedServices === 2 ? 'bg-gray-700' : ''}`}
          onClick={() => handleServiceClick(2)}
        >
          {/* Наименование и другие детали второй карточки */}
          <h2 className="text-white text-xl font-bold">Service 2</h2>
        </div>
      </div>

      <button
        className="mt-4 bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleBookNowClick}
      >
        Choose Time
      </button>
    </div>
  );
};

export default Services;
