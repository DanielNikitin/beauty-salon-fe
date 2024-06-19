import React, { useState, useContext } from 'react';
import { BookingContext } from '../../components/BookingHandler';
import { useRouter } from 'next/router';

const Master = () => {
  const router = useRouter();

  const { bookingData, setBookingData } = useContext(BookingContext);

  const [selectedCard, setSelectedCard] = useState(null);
  
  const [errorMessage, setErrorMessage] = useState('');

  const handleCardClick = (cardNumber) => {
    if (selectedCard === cardNumber) {
      setSelectedCard(null);
      setBookingData({ ...bookingData, specialist: null });
    } else {
      setSelectedCard(cardNumber);
      setBookingData({ ...bookingData, specialist: `Specialist ${cardNumber}` });
    }
  };

  const handleBookNowClick = () => {
    if (selectedCard !== null) {
      console.log(`Specialist confirmed for ${selectedCard}`);
      setErrorMessage('');
      
      // switch to service page
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

      <div className="flex">
        <div className={`relative rounded-lg shadow-lg p-4 mr-4 bg-slate-600 bg-item bg-cover w-[300px] h-[300px] ${selectedCard === 1 ? 'border-2 border-slate-400' : ''}`} onClick={() => handleCardClick(1)}>
          {/* Наименование карточки и другие детали */}
        </div>
        <div className={`relative rounded-lg shadow-lg p-4 bg-slate-600 bg-item bg-cover w-[300px] h-[300px] ${selectedCard === 2 ? 'border-2 border-slate-400' : ''}`} onClick={() => handleCardClick(2)}>
          {/* Наименование карточки и другие детали */}
        </div>
      </div>
      <button className="mt-4 bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded" onClick={handleBookNowClick}>
        Choose Service
      </button>
    </div>
  );
}

export default Master;
