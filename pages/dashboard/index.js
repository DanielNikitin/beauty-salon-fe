import React, { useState, useEffect } from 'react';
import { checkServerStatus } from '../../components/Status';
import CreateSpecialistForm from './CreateSpecialistForm';
import SpecialistList from './SpecialistList';
import DeleteSpecialist from './DeleteSpecialist';
import BookingList from './BookingList';

const Dashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSpecialistList, setShowSpecialistList] = useState(false);
  const [showDeleteSpecialist, setShowDeleteSpecialist] = useState(false);
  const [showBookingList, setShowBookingList] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [serverStatus, setServerStatus] = useState('Checking...');

  useEffect(() => {
    const fetchServerStatus = async () => {
      const status = await checkServerStatus();
      setServerStatus(status);
    };

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAddSpecialistSuccess = (message) => {
    setSuccessMessage(message);
    setShowCreateForm(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAddSpecialistError = (error) => {
    setErrorMessage(`ERROR: ${error}`);
    setTimeout(() => setErrorMessage(''), 5000);
  };

  const handleDeleteSpecialistSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteSpecialistError = (error) => {
    setErrorMessage(`ERROR: ${error}`);
    setTimeout(() => setErrorMessage(''), 5000);
  };

  return (
    <div className="bg-gray-600 min-h-screen flex">
      <div className="bg-primary/70 w-64 py-4 px-6 flex-shrink-0">
        <h1 className="text-4xl font-bold text-white mb-6">DASHBOARD</h1>

        <button
          className="block w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4 focus:outline-none focus:shadow-outline"
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setShowSpecialistList(false);
            setShowDeleteSpecialist(false);
            setShowBookingList(false);
          }}
        >
          {showCreateForm ? 'Close Create Specialist' : 'Create Specialist'}
        </button>

        <button
          className="block w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4 focus:outline-none focus:shadow-outline"
          onClick={() => {
            setShowSpecialistList(!showSpecialistList);
            setShowCreateForm(false);
            setShowDeleteSpecialist(false);
            setShowBookingList(false);
          }}
        >
          {showSpecialistList ? 'Close Specialist List' : 'Specialist List'}
        </button>

        <button
          className="block w-full bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded mb-4 focus:outline-none focus:shadow-outline"
          onClick={() => {
            setShowDeleteSpecialist(!showDeleteSpecialist);
            setShowCreateForm(false);
            setShowSpecialistList(false);
            setShowBookingList(false);
          }}
        >
          {showDeleteSpecialist ? 'Close Delete Specialist' : 'Delete Specialist'}
        </button>

        <button
          className="block w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4 focus:outline-none focus:shadow-outline"
          onClick={() => {
            setShowBookingList(!showBookingList);
            setShowSpecialistList(false);
            setShowCreateForm(false);
            setShowDeleteSpecialist(false);
          }}
        >
          {showBookingList ? 'Close Booking List' : 'Booking List'}
        </button>
      </div>

      <div className="bg-primary flex-grow p-8 shadow-lg ml-4">
        {showCreateForm && (
          <CreateSpecialistForm
            onSuccess={handleAddSpecialistSuccess}
            onError={handleAddSpecialistError}
          />
        )}
        {showSpecialistList && <SpecialistList />}
        {showDeleteSpecialist && (
          <DeleteSpecialist
            onSuccess={handleDeleteSpecialistSuccess}
            onError={handleDeleteSpecialistError}
          />
        )}
        {showBookingList && <BookingList />}

        {successMessage && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
            {errorMessage}
          </div>
        )}

          <div className="absolute bottom-4 left-4">
          <p className={`text-lg font-bold ${serverStatus === 'Server status: Online' ? 'text-green-500' : 'text-red-500'}`}>
            {serverStatus}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
