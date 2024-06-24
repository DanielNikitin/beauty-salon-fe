// DeleteSpecialist.jsx

import React, { useState, useEffect } from 'react';

const DeleteSpecialist = ({ onSuccess, onError }) => {
  const [specialists, setSpecialists] = useState([]);

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
      onError(`Error fetching specialists: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/specialists/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete specialist');
      }
      // Успешно удаленный специалист убирается из списка
      setSpecialists((prevSpecialists) =>
        prevSpecialists.filter((specialist) => specialist.id !== id)
      );
      onSuccess('Specialist deleted successfully.');
    } catch (error) {
      console.error('Error deleting specialist:', error);
      onError(`Error deleting specialist: ${error.message}`);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Specialist List for Delete</h2>
      <ul>
        {specialists.map((specialist) => (
          <li key={specialist.id} className="mb-2">
            <strong>{specialist.name}</strong> - {specialist.services}
            <button
              className="ml-4 bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => handleDelete(specialist.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeleteSpecialist;