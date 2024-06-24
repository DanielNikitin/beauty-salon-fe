import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import CopyrightXL from '../components/Copyright_xl';

const Home = () => {
  const router = useRouter();
  const [serverStatus, setServerStatus] = useState('Checking...');

  useEffect(() => {
    // Функция для проверки статуса сервера
    const checkServerStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/getcalendardata');
        if (response.ok) {
          setServerStatus('Server status: Online');
        } else {
          setServerStatus('Server status: Offline');
        }
      } catch (error) {
        console.error('Error checking server status:', error);
        setServerStatus('Server status: Offline');
      }
    };

    // Вызываем функцию для первичной проверки статуса сервера
    checkServerStatus();

    // Устанавливаем интервал для повторной проверки каждые 10 секунд
    const interval = setInterval(checkServerStatus, 10000);

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(interval);
  }, []);

  const handleBookNowClick = () => {
    router.push('/specialist');
  };

  return (
    <div className='bg-primary/60 h-full'>
      <div className='w-full h-full absolute left-24 bottom-0'>
        <div className='flex flex-col justify-center xl:pt-12 xl:text-left h-full container mx-auto'>
          IN DEVELOPMENT

          <button
            className='bg-gray-500 hover:bg-gray-700 w-[150px] text-white font-bold py-2 px-4 rounded'
            onClick={handleBookNowClick}
          >
            Book Now
          </button>
          <p className="text-lg mt-4">{serverStatus}</p>
        </div>
      </div>
      <CopyrightXL />
    </div>
  );
};

export default Home;
