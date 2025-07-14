import React, { useState } from 'react';

const ChevronLeft = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const WeeklyCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekDays = [
    { date: '25/04/2025', dayName: 'Segunda', events: [] },
    { date: '26/04/2025', dayName: 'Terça', events: [] },
    { date: '27/04/2025', dayName: 'Quarta', events: [] },
    { date: '28/04/2025', dayName: 'Quinta', events: [] },
    { date: '29/04/2025', dayName: 'Sexta', events: [
        { id: '1', title: 'Cálculo I', time: '9:30', location: 'A1315 - Mauro Luico Bet...', color: 'blue' },
        { id: '2', title: 'Algoritmos e Progra...', time: '13:30', location: 'A1315 - Fábio Paulo Basso', color: 'green' }
      ] },
    { date: '30/04/2025', dayName: 'Sábado', events: [] }
  ];

  const timeSlots = [
    '8:30', '9:30', '10:30', '11:30', '12:30', '13:30', '14:30', 
    '15:30', '16:30', '17:30', '18:30', '19:30', '20:30', '21:30'
  ];

  const getEventColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-100 border-blue-300 text-blue-900',
      green: 'bg-green-100 border-green-300 text-green-900',
      purple: 'bg-purple-100 border-purple-300 text-purple-900',
      orange: 'bg-orange-100 border-orange-300 text-orange-900'
    };
    return colors[color] || colors.blue;
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">25/04/2025 - Sexta-feira</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigateWeek('prev')} 
              className="p-2 border border-gray-200 rounded hover:bg-gray-100"
            >
              <ChevronLeft />
            </button>
            <button 
              onClick={() => navigateWeek('next')} 
              className="p-2 border border-gray-200 rounded hover:bg-gray-100"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">2 edições</span>
          <button className="px-3 py-1 bg-emerald-500 text-white text-sm rounded hover:bg-emerald-600">
            Restaurar versão
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-100">
          <div className="p-4 text-sm font-medium text-gray-600 border-r border-gray-200">Hora</div>
          {weekDays.map((day, i) => (
            <div key={i} className="p-4 text-center border-r border-gray-200 last:border-r-0">
              <div className="text-xs text-gray-500 uppercase tracking-wider">{day.dayName}</div>
              <div className="text-sm font-medium text-gray-900 mt-1">{day.date.split('/')[0]}</div>
            </div>
          ))}
        </div>

        <div className="relative">
          {timeSlots.map((time, timeIdx) => (
            <div key={timeIdx} className="grid grid-cols-8 border-b border-gray-200 min-h-[60px]">
              <div className="p-3 text-sm text-gray-500 border-r border-gray-200 bg-gray-100 flex items-start">
                {time}
              </div>
              {weekDays.map((day, dayIdx) => {
                const events = day.events.filter(event => event.time === time);
                return (
                  <div key={dayIdx} className="p-2 border-r border-gray-200 last:border-r-0">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className={`p-3 border rounded mb-2 text-sm font-medium ${getEventColorClass(event.color)}`}
                      >
                        <div>{event.title}</div>
                        {event.location && (
                          <div className="text-xs opacity-75">{event.location}</div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
