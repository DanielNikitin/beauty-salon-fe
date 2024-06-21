// Dashboard.js

import React, { useState } from 'react';
import CreateSpecialistForm from './CreateSpecialistForm';
import SpecialistList from './SpecialistList';
import DeleteSpecialist from './DeleteSpecialist';

const Dashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSpecialistList, setShowSpecialistList] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Функция для обработки успешного добавления специалиста
  const handleAddSpecialistSuccess = () => {
    setSuccessMessage('Specialist sucessfully created');

    // Скрыть сообщение через 3 секунды
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Функция для обработки ошибки при добавлении специалиста
  const handleAddSpecialistError = (error) => {
    setErrorMessage(`ERROR: ${error}`);

    // Скрыть сообщение об ошибке через 5 секунд
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };

  // Функция для обработки отправки формы добавления специалиста
  const handleSubmit = async (newSpecialistData) => {
    try {
      const response = await fetch('http://localhost:3001/api/specialists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSpecialistData),
      });

      if (response.ok) {
        console.log('Новый специалист успешно добавлен');
        setCreateShowForm(false);
        setShowSpecialistList(true);
        handleAddSpecialistSuccess();
      } else {
        const errorMessage = await response.json();
        console.error('ERROR:', errorMessage.error);
        handleAddSpecialistError(errorMessage.error);
      }
    } catch (error) {
      console.error('ERROR:', error);
      handleAddSpecialistError('Something went wrong, try again');
    }
  };

  return (
    <div className="bg-primary/60 min-h-screen flex">
      {/* Левая панель с надписью DASHBOARD и кнопками */}
      <div className="bg-primary/70 w-64 py-4 px-6 flex-shrink-0">
        <h1 className="text-4xl font-bold text-white mb-6">DASHBOARD</h1>

        {/* Кнопка для отображения формы добавления специалиста */}
        <button
          className="block w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4 focus:outline-none focus:shadow-outline"
          onClick={() => {
            setShowCreateForm(true);
            setShowSpecialistList(false); // Скрыть список специалистов при открытии формы
          }}
        >
          Create Specialist
        </button>

        {/* Кнопка для отображения списка специалистов */}
        <button
          className="block w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4 focus:outline-none focus:shadow-outline"
          onClick={() => {
            setShowSpecialistList(!showSpecialistList);
            setShowCreateForm(false);
          }}
        >
          {showSpecialistList ? 'Close Specialist List' : 'Specialist List'}
        </button>

          {/* Кнопка для удаления специалистов */}
          <button
          className="block w-full bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded mb-4 focus:outline-none focus:shadow-outline"
          onClick={() => {
            setShowSpecialistList(!showSpecialistList);
            setShowCreateForm(false);
          }}
        >
          {showSpecialistList ? 'Close Delete Specialist' : 'Delete Specialist'}
        </button>
      </div>

      {/* Основное содержимое */}
      <main className="flex-grow p-6">
        {/* Форма для добавления нового специалиста */}
        {showCreateForm && <CreateSpecialistForm onSubmit={handleSubmit} onCancel={() => setShowCreateForm(false)} />}

        {/* Список специалистов */}
        {showSpecialistList && <SpecialistList />}
        
        {/* Сообщение об успешном добавлении */}
        {successMessage && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
            {successMessage}
          </div>
        )}

        {/* Сообщение об ошибке */}
        {errorMessage && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
            {errorMessage}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
