import React, { useState } from 'react';

const Services = () => {
  // Создаем состояние для хранения выбранной услуги
  const [selectedService, setSelectedService] = useState(null);

  // Функция для выбора услуги
  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Choose a Service</h1>
      <div className="flex flex-col space-y-4">
        {/* Список услуг */}
        <div
          className={`p-4 rounded-lg cursor-pointer ${
            selectedService === 'Service 1' ? 'bg-gray-700' : ''
          }`}
          onClick={() => handleServiceClick('Service 1')}
        >
          Service 1
        </div>
        <div
          className={`p-4 rounded-lg cursor-pointer ${
            selectedService === 'Service 2' ? 'bg-gray-700' : ''
          }`}
          onClick={() => handleServiceClick('Service 2')}
        >
          Service 2
        </div>
        <div
          className={`p-4 rounded-lg cursor-pointer ${
            selectedService === 'Service 3' ? 'bg-gray-700' : ''
          }`}
          onClick={() => handleServiceClick('Service 3')}
        >
          Service 3
        </div>
      </div>
      
      {/* Кнопка "Book Now" */}
      <button
        className="mt-8 bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => console.log(`Booking confirmed for service: ${selectedService}`)}
        disabled={!selectedService}
      >
        Book Now
      </button>
    </div>
  );
};

export default Services;
