import React, { useState, useEffect } from 'react';
import axios from 'axios';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Calendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentYear, setCurrentYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCalendarData = await axios.get('http://localhost:3001/api/calendardata');
        setCalendarData(resCalendarData.data.calendarData);
        console.log("Calendar Data:", resCalendarData.data.calendarData);
        setDataFetched(true);
        setServerError(false);

        const resCurrentMonthData = await axios.get('http://localhost:3001/api/monthdata');
        setCurrentYear(resCurrentMonthData.data.currentMonthData.year);
      } catch (error) {
        console.error('Error fetching data:', error);
        setServerError(true);
      }
    };

    if (!dataFetched) {
      fetchData();
    }
  }, [dataFetched]);

  useEffect(() => {
    if (calendarData.length > 0 && currentYear !== null && currentIndex >= 0 && currentIndex < calendarData.length) {
      handleFetchMonthData();
    }
  }, [currentIndex]);

  const nextMonth = () => {
    if (currentIndex < calendarData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevMonth = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFetchMonthData = async () => {
    const selectedMonth = calendarData[currentIndex];
    const formattedMonth = selectedMonth.monthIndex.toString().padStart(2, '0');

    const currentMonthRequest = `http://localhost:3001/api/monthdata/${currentYear}/${formattedMonth}`;

    let prevMonthIndex = currentIndex > 0 ? currentIndex - 1 : calendarData.length - 1;
    let nextMonthIndex = currentIndex < calendarData.length - 1 ? currentIndex + 1 : 0;

    const prevMonth = calendarData[prevMonthIndex];
    const nextMonth = calendarData[nextMonthIndex];
    const formattedPrevMonth = prevMonth.monthIndex.toString().padStart(2, '0');
    const formattedNextMonth = nextMonth.monthIndex.toString().padStart(2, '0');

    const prevMonthRequest = `http://localhost:3001/api/monthdata/${currentYear}/${formattedPrevMonth}`;
    const nextMonthRequest = `http://localhost:3001/api/monthdata/${currentYear}/${formattedNextMonth}`;

    try {
      const [resCurrentMonth, resPrevMonth, resNextMonth] = await Promise.all([
        axios.get(currentMonthRequest),
        axios.get(prevMonthRequest),
        axios.get(nextMonthRequest)
      ]);

      console.log("Selected Month Data:", resCurrentMonth.data);
      console.log("Previous Month Data:", resPrevMonth.data);
      console.log("Next Month Data:", resNextMonth.data);

      setSelectedMonth(resCurrentMonth.data);

    } catch (error) {
      console.error('Error fetching month data:', error);
    }
  };

  const findFirstDayOfWeek = (daysArray) => {
    const firstDayObject = daysArray.find(day => day.day_number === 1);
    if (firstDayObject) {
      const dayName = firstDayObject.day_name;
      switch (dayName) {
        case 'Sunday':
          return 6;
        case 'Monday':
          return 0;
        case 'Tuesday':
          return 1;
        case 'Wednesday':
          return 2;
        case 'Thursday':
          return 3;
        case 'Friday':
          return 4;
        case 'Saturday':
          return 5;
        default:
          return 0; // По умолчанию, если что-то пойдет не так
      }
    } else {
      return 0; // По умолчанию, если нет информации о днях в массиве
    }
  };

  const renderCalendarCells = () => {
    console.log("RCC :: Selected Month Data:", selectedMonth);

    if (!selectedMonth || !selectedMonth.days) {
      return null;
    }

    const daysInMonth = selectedMonth.days.length;
    const firstDayOfWeekIndex = findFirstDayOfWeek(selectedMonth.days);

    let cells = [];

    // Отображение дней недели
    daysOfWeek.forEach((day, index) => {
      cells.push(<div key={`day-${index}`} className="text-center font-sora text-gray-500 text-lg">{day}</div>);
    });

    // Отображение дней предыдущего месяца
    for (let i = 0; i < firstDayOfWeekIndex; i++) {
      cells.push(<div key={`prev-${i}`} className="text-center text-orange-600"></div>);
    }

    // Отображение дней текущего месяца
    selectedMonth.days.forEach((day, index) => {
      cells.push(
        <div
          key={`current-${day.day_number}`}
          className={`text-center cursor-pointer`}
          onClick={() => handleDateClick(day.day_number, selectedMonth.month, selectedMonth.year)}
        >
          {day.day_number}
        </div>
      );
    });

    // Отображение дней следующего месяца, если требуется
    const remainingCells = 42 - cells.length;
    for (let i = 0; i < remainingCells; i++) {
      cells.push(<div key={`next-${i}`} className="text-center text-lime-600"></div>);
    }

    return cells;
  };

  const handleDateClick = (day, month, year) => {
    console.log(`Clicked: ${day}-${month}-${year}`);
    // Действия при клике на день
  };

  return (
    <div className="w-[600px] h-full bg-gray-800 p-3">
      <div className="mt-2 bg-gray-800 flex flex-col justify-between h-[280px] shadow-[0_15px_10px_-10px_rgba(0,0,0,0.25)]">
        <div className="px-4 mb-3">
          <div className="flex justify-between items-center">
            <button className="text-gray-400" onClick={prevMonth}>Prev</button>
            <div className="flex justify-center overflow-hidden whitespace-nowrap">
              {calendarData.map((month, index) => (
                <div key={index} className={`text-center text-gray-400 px-4 py-2 ${index === currentIndex ? '' : 'hidden'}`}>
                  {`${month.monthName} (${month.numberOfDays} days)`}
                </div>
              ))}
            </div>
            <button className="text-gray-400" onClick={nextMonth}>Next</button>
          </div>
          <div className="flex-grow">
            <div className="grid grid-cols-7 gap-3 gap-x-14">
              {renderCalendarCells()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
