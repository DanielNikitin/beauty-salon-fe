import React, { useContext, useState } from 'react';
import { BookingContext } from '../../components/BookingHandler';
import { useRouter } from 'next/router';

const Details = () => {
  const { bookingData, setBookingData } = useContext(BookingContext);
  const [formData, setFormData] = useState(bookingData.personalInfo);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingData({ ...bookingData, personalInfo: formData });

    // Отправка данных на сервер
    const response = await fetch('/api/submit-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (response.ok) {
      console.log('Booking submitted successfully');
      // Перенаправление или выполнение других действий по завершению
      router.push('/confirmation');
    } else {
      console.error('Failed to submit booking');
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
          className="mb-2 p-2 border border-gray-700 rounded"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Phone"
          className="mb-2 p-2 border border-gray-700 rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="mb-2 p-2 border border-gray-700 rounded"
        />
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          placeholder="Comment"
          className="mb-2 p-2 border border-gray-700 rounded"
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
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Book
        </button>
      </form>
    </div>
  );
};

export default Details;
