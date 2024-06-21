// SpecialistList.js

import React, { useState, useEffect } from 'react';

const SpecialistList = () => {
  const [specialists, setSpecialists] = useState([]);

  useEffect(() => {
    fetchSpecialists();
  }, []);

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
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Specialist List</h2>
      <ul>
        {specialists.map((specialist) => (
          <li key={specialist.id} className="mb-2">
            <strong>{specialist.name}</strong> - {specialist.services}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpecialistList;
