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
          const resCalendarData = await axios.get('http://localhost:3001/api/calendardata');
          setCalendarData(resCalendarData.data.calendarData);

          const resMonthData = await axios.get('http://localhost:3001/api/monthdata');
          setCurrentMonthData(resMonthData.data.currentMonthData);

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

  const renderCalendarCells = () => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const daysInMonth = currentMonthData.NumberOfDays;
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
        </div>
        <div className="flex-grow">
          <div className="grid grid-cols-7 gap-3 gap-x-14">
            {renderCalendarCells()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
