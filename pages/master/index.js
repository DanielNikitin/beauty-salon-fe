import React, { useState } from 'react';

const Master = () => {
  // Создаем состояние, чтобы хранить информацию о выбранной карточке
  const [selectedCard, setSelectedCard] = useState(null);
  // Создаем состояние для сообщения об ошибке
  const [errorMessage, setErrorMessage] = useState('');

  // Функция для обработки клика на карточке
  const handleCardClick = (cardNumber) => {
    // Если карточка уже выбрана, снова сбрасываем ее состояние
    if (selectedCard === cardNumber) {
      setSelectedCard(null);
    } else {
      // Иначе, устанавливаем выбранную карточку в состояние
      setSelectedCard(cardNumber);
    }
  };

  // Функция для обработки нажатия кнопки "Book Now"
  const handleBookNowClick = () => {
    if (selectedCard !== null) {
      // Если выбрана карточка, можно выполнить необходимые действия, например, отправить данные на сервер
      console.log(`Booking confirmed for card ${selectedCard}`);
      // Сбрасываем сообщение об ошибке
      setErrorMessage('');
    } else {
      // Если карточка не выбрана, устанавливаем сообщение об ошибке
      setErrorMessage('Please select a master first');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Сообщение об ошибке */}
      {errorMessage && (
        <div className="bg-red-500 text-white p-2 mb-4">{errorMessage}</div>
      )}
      <div className="flex">
        {/* Карточка 1 */}
        <div className={`relative rounded-lg shadow-lg p-4 mr-4 bg-slate-600 bg-item bg-cover w-[300px] h-[300px] ${selectedCard === 1 ? 'border-2 border-slate-400' : ''}`} onClick={() => handleCardClick(1)}>
          {/* Наименование карточки и другие детали */}
        </div>
        {/* Карточка 2 */}
        <div className={`relative rounded-lg shadow-lg p-4 bg-slate-600 bg-item bg-cover w-[300px] h-[300px] ${selectedCard === 2 ? 'border-2 border-slate-400' : ''}`} onClick={() => handleCardClick(2)}>
          {/* Наименование карточки и другие детали */}
        </div>
      </div>
      {/* Кнопка "Book Now" */}
      <button className="mt-4 bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded" onClick={handleBookNowClick}>
        Book Now
      </button>
    </div>
  );
}

export default Master;
