import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BookingContext } from '../components/BookingHandler';
import { useRouter } from 'next/router';

const Calendar = () => {
  const router = useRouter();

  const { bookingData, setBookingData } = useContext(BookingContext);

  const [calendarData, setCalendarData] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState({});
  const [prevMonthData, setPrevMonthData] = useState({});
  const [nextMonthData, setNextMonthData] = useState({});

  const [availableTimesForMonth, setAvailableTimesForMonth] = useState([]);
  const [nextAvailableDate, setNextAvailableDate] = useState('');
  const [monthDates, setMonthDates] = useState([]);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState([]);

  const [isNextMonthClicked, setIsNextMonthClicked] = useState(false);
  const [isPrevMonthClicked, setIsPrevMonthClicked] = useState(false);

  const [dataFetched, setDataFetched] = useState(false);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!dataFetched) {
          const resCalendarData = await axios.get('http://localhost:3001/getcalendardata');
          setCalendarData(resCalendarData.data.calendarData);

          const resMonthData = await axios.get('http://localhost:3001/getmonthdata');
          setCurrentMonthData(resMonthData.data.currentMonthData);

          const resAvailableTimes = await axios.get('http://localhost:3001/getavailabletimes');
          const availableTimes = resAvailableTimes.data.AvailableTimesForMonths || [];
          setAvailableTimesForMonth(availableTimes);

          const resPrevMonthData = await axios.get('http://localhost:3001/getpreviousmonthdata');
          setPrevMonthData(resPrevMonthData.data.previousMonthData);

          const resNextMonthData = await axios.get('http://localhost:3001/getnextmonthdata');
          setNextMonthData(resNextMonthData.data.nextMonthData);

          const nextAvailable = availableTimes.find(dateData => dateData.availableTimes.length > 0);
          if (nextAvailable) {
            setNextAvailableDate(nextAvailable.date);
          }

          const monthDates = availableTimes.map(dateData => dateData.date);
          setMonthDates(monthDates);

          setDataFetched(true);
          setServerError(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setServerError(true);
      }
    };

    fetchData();
  }, [dataFetched]);

  if (serverError) {
    return <div>Server Temporary Not Working</div>;
  }

  const handleDateClick = (day, month, year) => {
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const selectedDate = `${year}-${formattedMonth}-${formattedDay}`;
    setSelectedDate(selectedDate);
    const selectedDateData = availableTimesForMonth.find(dateData => dateData.date === selectedDate);
    if (selectedDateData) {
      const availableTimes = selectedDateData.availableTimes;
      setSelectedTime(''); // Reset selected time when a new date is selected
      setBookingData({ ...bookingData, selectedDate, selectedTime: '' });
    } else {
      setSelectedTime('');
      setBookingData({ ...bookingData, selectedDate, selectedTime: '' });
    }
  };

  const handleNextMonthClick = async () => {
    try {
      const response = await axios.post('http://localhost:3001/nextmonth');
      setCurrentMonthData(response.data.currentMonthData);
      setIsNextMonthClicked(true);
      setIsPrevMonthClicked(false);
    } catch (error) {
      console.error('Error switching to next month:', error);
    }
  };

  const handlePrevMonthClick = async () => {
    try {
      const response = await axios.post('http://localhost:3001/prevmonth');
      setCurrentMonthData(response.data.currentMonthData);
      setIsPrevMonthClicked(true);
      setIsNextMonthClicked(false);
    } catch (error) {
      console.error('Error switching to previous month:', error);
    }
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
    setBookingData({ ...bookingData, selectedTime: time });
  };

  const handleBookAppointment = () => {
    console.log('Booking Data:', bookingData);
    // switch to service page
    router.push('/details');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    return `${month} ${day}`;
  };

  const renderTimeButtons = () => {
    if (!selectedDate || availableTimesForMonth.length === 0) {
      return null;
    }

    const selectedDateData = availableTimesForMonth.find(dateData => dateData.date === selectedDate);
    if (!selectedDateData) {
      return null;
    }

    const { availableTimes } = selectedDateData;

    if (availableTimes.length === 0) {
      let formattedNextAvailableDate = '';

      try {
        formattedNextAvailableDate = formatDate(nextAvailableDate);
      } catch (error) {
        console.error('Error formatting date:', error);
      }

      return (
        <div className="text-center">
          <p className="font-bold text-xl text-gray-300">There are no available spots for this day</p>
          <p className="font-thin text-md text-gray-50">Next available date:</p>
          <button
            className="font-thin text-2xl text-white/70 underline underline-offset-8 decoration-white/50 decoration-1
            hover:decoration-white hover:text-white"
            onClick={() => handleDateClick(
              parseInt(nextAvailableDate.split('-')[2], 10),
              parseInt(nextAvailableDate.split('-')[1], 10),
              parseInt(nextAvailableDate.split('-')[0], 10)
            )}
          >
            {formattedNextAvailableDate}
          </button>
        </div>
      );
      
    }

    const morningTimes = availableTimes.filter(time => parseInt(time.split(':')[0], 10) < 12);
    const dayTimes = availableTimes.filter(time => parseInt(time.split(':')[0], 10) >= 12);

    const renderTimes = (times) => {
      return times.map((time, index) => {
        const isSelectedTime = selectedTime === `${time}`;
        return (
          <button
            key={index}
            className={`text-white/70 hover:text-white p-3 m-2 ${isSelectedTime ? 'rounded-full bg-gray-500' : ''}`}
            onClick={() => handleTimeClick(time)}
          >
            {time}
          </button>
        );
      });
    };

    return (
      <div>
        {morningTimes.length > 0 && (
          <div>
            <h2 className="font-thin text-white mb-2 text-xl">Morning</h2>
            <div className="flex flex-wrap">
              {renderTimes(morningTimes)}
            </div>
          </div>
        )}
        
        {dayTimes.length > 0 && (
          <div>
            <h2 className="font-thin text-white mt-4 mb-2 text-xl">Day</h2>
            <div className="flex flex-wrap">
              {renderTimes(dayTimes)}
            </div>
          </div>
        )}

        {selectedTime.length > 0 && (
        <div className="w-full flex justify-center mt-4">
        <button
          onClick={handleBookAppointment}
          className="w-full text-center text-xl font-thin py-2 text-white bg-gray-700 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
        >
          Book
        </button>
        </div>
        )}
    </div>
  );
};

  const renderCalendarCells = () => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const daysInMonth = currentMonthData.currentNumberOfDays;
    const currentMonthIndex = currentMonthData.currentMonthIndex;

    const firstDayOfWeek = new Date(currentMonthData.currentYear, currentMonthIndex - 1, 1).getDay();
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === currentMonthData.currentYear && today.getMonth() + 1 === currentMonthData.currentMonthIndex;

    let cells = [];

    daysOfWeek.forEach((day, index) => {
      cells.push(<div key={`day-${index}`} className="text-center font-sora text-gray-500 text-lg">{day}</div>);
    });

    const prevMonthDays = prevMonthData.numberOfDays || 0;
    for (let i = startOffset - 1; i >= 0; i--) {
      const day = prevMonthDays - i;

      cells.push(
        <div key={`prev-${day}`} className="text-center text-gray-700">
          {day}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isPastDay = isCurrentMonth && day < today.getDate();
      const isToday = isCurrentMonth && day === today.getDate();
      const isSelected = selectedDate === `${currentMonthData.currentYear}-${String(currentMonthIndex).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      const isEmptyDay = availableTimesForMonth.some(dateData => dateData.date === `${currentMonthData.currentYear}-${String(currentMonthIndex).padStart(2, '0')}-${String(day).padStart(2, '0')}` && dateData.availableTimes.length === 0);

      cells.push(
        <div
          key={`current-${day}`}
          className={`text-center cursor-pointer
          ${isToday && !isSelected ? 'rounded-full bg-gray-700 text-white/70' : ''} 
          ${isEmptyDay ? 'text-gray-600' : ''}
          ${isPastDay ? 'text-gray-600' : ''}
          ${isSelected ? 'rounded-full bg-gray-500' : ''}
          `}
          onClick={() => handleDateClick(day, currentMonthIndex, currentMonthData.currentYear)}
        >
          {day}
        </div>
      );
    }

    const nextMonthStart = 1;
    const nextMonthIndex = currentMonthIndex === 12 ? 1 : currentMonthIndex + 1;
    for (let i = cells.length, nextDay = nextMonthStart; i < 42; i++, nextDay++) {
      cells.push(
        <div
          key={`next-${nextDay}`}
          className="text-center text-gray-600 cursor-pointer"
          onClick={() => handleDateClick(nextDay, nextMonthIndex, currentMonthData.currentYear)}
        >
          {nextDay}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="w-[600px] h-full bg-gray-800 p-3">
      <div className="mt-2 bg-gray-800 flex flex-col justify-between h-[280px] shadow-[0_15px_10px_-10px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-thin">{currentMonthData.currentMonthName}</h1>
          <div className="flex space-x-3">
            <button
              onClick={handlePrevMonthClick}
              className={`text-xl font-thin ${isPrevMonthClicked || !isNextMonthClicked ? 'text-white/20' : 'text-white/70 hover:text-white'}`}
              disabled={isPrevMonthClicked}
            >
              Prev
            </button>
            <button
              onClick={handleNextMonthClick}
              className={`text-xl font-thin ${isNextMonthClicked ? 'text-white/20' : 'text-white/70 hover:text-white'}`}
              disabled={isNextMonthClicked}
            >
              Next
            </button>
          </div>
        </div>
        <div className="flex-grow">
          <div className="grid grid-cols-7 gap-3 gap-x-14">
            {renderCalendarCells()}
          </div>
        </div>
        <div className="mt-12">
          {renderTimeButtons()}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
