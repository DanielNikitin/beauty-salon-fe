import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { checkServerStatus } from '../components/Status';
import CopyrightXL from '../components/Copyright_xl';

const Home = () => {
  const router = useRouter();
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchServerStatus = async () => {
      const status = await checkServerStatus();
      setServerStatus(status);
    };

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleBookNowClick = async () => {
    const status = await checkServerStatus();
    if (status === 'Server status: Online') {
      router.push('/specialist');
    } else {
      setErrorMessage('Server is offline, please try again later.');
    }
  };

  return (
    <div className='bg-primary/60 h-full'>
      <div className='w-full h-full absolute left-24 bottom-0'>
        <div className='flex flex-col justify-center xl:pt-12 xl:text-left h-full container mx-auto'>
          IN DEVELOPMENT

          <button
            className='bg-gray-500 hover:bg-gray-700 w-[150px] text-white font-bold py-1 px-4 rounded'
            onClick={handleBookNowClick}
          >
            Book Now
          </button>
        </div>
      </div>
      {errorMessage && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          {errorMessage}
        </div>
      )}
      <CopyrightXL />
    </div>
  );
};

export default Home;
