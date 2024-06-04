import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState({});
  const [prevMonthData, setPrevMonthData] = useState({});
  const [nextMonthData, setNextMonthData] = useState({});
  const [availableTimesForMonth, setAvailableTimesForMonth] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
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
          setAvailableTimesForMonth(resAvailableTimes.data.AvailableTimesForMonth);

          const resPrevMonthData = await axios.get('http://localhost:3001/getpreviousmonthdata');
          setPrevMonthData(resPrevMonthData.data.previousMonthData);

          const resNextMonthData = await axios.get('http://localhost:3001/getnextmonthdata');
          setNextMonthData(resNextMonthData.data.nextMonthData);

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
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    const selectedDate = `${year}-${month}-${day}`;
    setSelectedDate(selectedDate);
    const selectedDateData = availableTimesForMonth.find(dateData => dateData.date === selectedDate);
    if (selectedDateData) {
      const availableTimes = selectedDateData.availableTimes;
      setSelectedTime(availableTimes);
    } else {
      setSelectedTime([]);
    }
  };

  const handleTimeClick = (time) => {
    console.log(`Вы нажали на ${time} для даты ${selectedDate}`);
  };

  const renderTimeButtons = () => {
    if (selectedTime.length === 0) {
      return (
        <div className="text-center">
          <p className='font-bold text-xl text-gray-300'>There are no available spots for this day</p>
          <p className='font-thin text-md text-gray-50'>Next available date:</p>
        </div>
      );
    }

    const morningTimes = selectedTime.filter(time => parseInt(time.split(':')[0], 10) < 12);
    const dayTimes = selectedTime.filter(time => parseInt(time.split(':')[0], 10) >= 12);

    const renderTimes = (times) => {
      return times.map((time, index) => (
        <button
          key={index}
          className="rounded-full bg-gray-500 text-white p-3 m-2"
          onClick={() => handleTimeClick(time)}
        >
          {time}
        </button>
      ));
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
      cells.push(<div key={`day-${index}`} className="text-center font-sora text-gray-500 text-lg/2">{day}</div>);
    });

    const prevMonthDays = prevMonthData.numberOfDays || 0;
    for (let i = startOffset - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const month = currentMonthIndex === 1 ? 12 : currentMonthIndex - 1;
      cells.push(
        <div
          key={`prev-${day}`}
          className="text-center text-gray-500 cursor-pointer"
          onClick={() => handleDateClick(day, month, currentMonthData.currentYear)}
        >
          {day}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && today.getDate() === day;
      const isPastDay = isCurrentMonth && today.getDate() > day;
      const isFutureDay = isCurrentMonth && today.getDate() <= day;
      cells.push(
        <div
          key={`current-${day}`}
          className={`text-center ${isToday ? 'rounded-full bg-white/80 text-primary/90' : ''} ${isPastDay ? 'text-orange-800' : ''} ${isFutureDay ? 'text-white' : ''} cursor-pointer`}
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
          className="text-center text-orange-400 cursor-pointer"
          onClick={() => handleDateClick(nextDay, nextMonthIndex, currentMonthData.currentYear)}
        >
          {nextDay}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="w-[600px] h-full bg-gray-800 p-3 top-0">
      <div className="relative top-28 h-[240px] bg-gray-800 flex flex-col justify-between rounded-b-xl
      shadow-[0_15px_10px_-10px_rgba(0,0,0,0.25)]">
      <div className="absolute -top-12 tracking-wider left-0 flex justify-between items-center">
        <h1 className="text-left text-xl font-thin">{currentMonthData.currentMonthName}</h1>
      </div>
      <div className="flex-grow">
        <div className="grid grid-cols-7 gap-3 gap-x-14">
          {renderCalendarCells()}
        </div>
      </div>
      <div className="mt-14">
        {renderTimeButtons()}
      </div>
    </div>
  </div>
);
};

export default Calendar;