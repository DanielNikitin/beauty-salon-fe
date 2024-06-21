// CreateSpecialistForm.jsx

import React, { useState } from 'react';

const CreateSpecialistForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [services, setServices] = useState('');
  const [inactiveDays, setInactiveDays] = useState('');
  const [workingTimes, setWorkingTimes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const newSpecialistData = {
      name,
      services,
      inactiveDays,
      workingTimes,
      photo: photoUrl,
    };

    onSubmit(newSpecialistData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-700 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl mb-4 text-white">Добавить нового специалиста</h2>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">
            Имя специалиста:
          </label>
          <input
            type="text"
            id="name"
            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 focus:outline-none focus:shadow-outline"
            placeholder="Например, Иван Петров"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="services" className="block mb-2 text-sm font-medium text-white">
            Услуги:
          </label>
          <input
            type="text"
            id="services"
            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 focus:outline-none focus:shadow-outline"
            placeholder="Например, Массаж, Физиотерапия"
            value={services}
            onChange={(e) => setServices(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="inactiveDays" className="block mb-2 text-sm font-medium text-white">
            Неактивные дни:
          </label>
          <input
            type="text"
            id="inactiveDays"
            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 focus:outline-none focus:shadow-outline"
            placeholder="Например, Понедельник, Суббота"
            value={inactiveDays}
            onChange={(e) => setInactiveDays(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="workingTimes" className="block mb-2 text-sm font-medium text-white">
            Время работы:
          </label>
          <input
            type="text"
            id="workingTimes"
            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 focus:outline-none focus:shadow-outline"
            placeholder="Например, 09:00 - 18:00"
            value={workingTimes}
            onChange={(e) => setWorkingTimes(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="photoUrl" className="block mb-2 text-sm font-medium text-white">
            URL Фото:
          </label>
          <input
            type="text"
            id="photoUrl"
            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 focus:outline-none focus:shadow-outline"
            placeholder="profile/specialist1.png"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-6">
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Добавить
        </button>
        <button
          type="button"
          className="ml-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={onCancel}
        >
          Отмена
        </button>
      </div>
    </form>
  );
};

export default CreateSpecialistForm;
