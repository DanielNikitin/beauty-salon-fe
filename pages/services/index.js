// Services.jsx

import React, { useEffect, useContext, useState } from 'react';
import { BookingContext } from '../../components/BookingHandler';
import { useRouter } from 'next/router';

const Services = () => {
  const router = useRouter();
  const { bookingData, setBookingData } = useContext(BookingContext);
  const [selectedServices, setSelectedServices] = useState([]);
  const [specialist, setSpecialist] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // If data is empty, so switch to /home page
    if (bookingData.specialistId) {
      fetchSpecialistDetails(bookingData.specialistId);
    } else {
      router.push('/');
    }
  }, [bookingData.specialistId]);

  const fetchSpecialistDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/specialists/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch specialist details');
      }
      const data = await response.json();
      setSpecialist(data);
    } catch (error) {
      console.error('Error fetching specialist details:', error);
      setErrorMessage(`Error fetching specialist details: ${error.message}`);
    }
  };

  const handleServiceCheckboxChange = (event) => {
    const serviceId = event.target.value;
    if (event.target.checked) {
      // Add service to selectedServices if checked
      setSelectedServices([...selectedServices, serviceId]);
    } else {
      // Remove service from selectedServices if unchecked
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    }
  };

  const handleBookNowClick = () => {
    if (selectedServices.length > 0) {
      // Update bookingData with selected services
      setBookingData({ ...bookingData, selectedServices });

      console.log(`Services confirmed for ${selectedServices}`);
      setErrorMessage('');

      // Redirect to booking page
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

      {specialist && (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Services of Specialist {specialist.id}</h2>
          <ul className="list-disc text-left">
            {specialist.services.split(',').map((service, index) => {
              const serviceId = `service-${index}`;
              return (
                <li key={serviceId} className="mb-2">
                  <input
                    type="checkbox"
                    id={serviceId}
                    value={serviceId}
                    onChange={handleServiceCheckboxChange}
                  />
                  <label htmlFor={serviceId} className="ml-2">
                    {service.trim()}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}

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
