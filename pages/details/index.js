import React, { useContext, useState } from 'react';
import { BookingContext } from '../../components/BookingHandler';
import { useRouter } from 'next/router';

const Details = () => {
  const router = useRouter();
  const { bookingData, setBookingData } = useContext(BookingContext);

  const [formData, setFormData] = useState(bookingData.personalInfo);
  const [agreementError, setAgreementError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверяем, что клиент согласился на обработку персональных данных
    if (!formData.agreedToPrivacyPolicy) {
      setAgreementError(true);
      return;
    }

    setBookingData({ ...bookingData, personalInfo: formData });

    try {
      // Отправляем данные на сервер
      const response = await fetch('http://localhost:3001/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...bookingData, personalInfo: formData }),
      });

      if (response.ok) {
        console.log('Booking submitted successfully');
        router.push('/confirmation');
      } else {
        console.error('Failed to submit booking');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white/20 p-6 rounded shadow-md">
        <h1 className="text-xl mb-4">Enter your details</h1>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="mb-2 p-2 bg-gray-800 border border-gray-600 text-white text-sm rounded-lg"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Phone"
          className="mb-2 p-2 bg-gray-800 border border-gray-600 text-white text-sm rounded-lg"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="mb-2 p-2 bg-gray-800 border border-gray-600 text-white text-sm rounded-lg"
        />
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          placeholder="Comment"
          className="mb-2 p-2 bg-gray-800 border border-gray-600 text-white text-sm rounded-lg"
        />
        <div className="mb-2">
          <label>
            <input
              type="checkbox"
              name="agreedToPrivacyPolicy"
              checked={formData.agreedToPrivacyPolicy}
              onChange={handleInputChange}
            />
            I agree to the processing of my personal data and confirm that I have read and accepted the Privacy Policy and User Agreement.
          </label>
        </div>
        {agreementError && (
          <div className="bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg p-2 mb-2">
            <p className="text-sm text-red-600">
              <span className="font-medium">Oh, snap!</span> Please agree to the processing of your personal data.
            </p>
          </div>
        )}
        <button type="submit" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Book
        </button>
      </form>
    </div>
  );
};

export default Details;
