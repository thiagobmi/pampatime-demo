import React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { EventCalendar } from './EventCalendar'; // Importando o componente EventCalendar

const Timetable = () => {
  // Eventos de exemplo
  const [events, setEvents] = useState([]);
  console.log('Eventos:', events);

  // Manipuladores de eventos para o EventCalendar
  const handleEventClick = (info) => {
    console.log('Evento clicado:', info.event);
  };

  const handleEventDrop = (info) => {
    console.log('Evento movido:', info.event);
    const updatedEvents = [...events];
    const eventIndex = updatedEvents.findIndex(e => e.id === info.event.id);
    
    if (eventIndex !== -1) {
      // Update existing event with new time/date
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        start: info.event.start,
        end: info.event.end
      };
      setEvents(updatedEvents);
    }
  };

  const handleEventResize = (info) => {
    console.log('Evento redimensionado:', info.event);
    const updatedEvents = [...events];
    const eventIndex = updatedEvents.findIndex(e => e.id === info.event.id);
    
    if (eventIndex !== -1) {
      // Update existing event with new duration
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        end: info.event.end
      };
      setEvents(updatedEvents);
    }
  };

  const handleEventReceive = (info) => {
    console.log('Evento recebido:', info.event);
    const newEvent = {
      id: info.event.id || `event-${Date.now()}`, // Generate ID if not provided
      title: info.event.title || 'New Event',
      start: info.event.start,
      end: info.event.end,
      // You can add more properties as needed
      backgroundColor: info.event.backgroundColor || '#3788d8',
      borderColor: info.event.borderColor || '#3788d8',
      textColor: info.event.textColor || '#ffffff',
    };
    const originalEventData = info.event.toPlainObject ? info.event.toPlainObject() : info.event;

    setEvents(prevEvents => [...prevEvents, { ...originalEventData, ...newEvent }]);
  };

  return (
    <div className="w-full h-full flex flex-col border border-gray-200 rounded-lg shadow-sm bg-white">
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium text-sm">A1-202</span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center divide-x divide-gray-200 rounded-md overflow-hidden border border-gray-300">
          <Button variant="outline" className="bg-white text-sm h-8 rounded-none rounded-l-md border-none">Professor</Button>
          <Button variant="outline" className="bg-white text-sm h-8 rounded-none border-none">Semestre</Button>
          <Button variant="outline" className="bg-pampa-green text-white hover:bg-pampa-green/90 text-sm h-8 rounded-none border-none">Sala</Button>
          <Button variant="outline" className="bg-white text-sm h-8 rounded-none rounded-r-md border-none">Curso</Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500" />
          <input
            type="text"
            placeholder="Pesquisar"
            className="pl-7 pr-8 py-1 w-full border rounded-md text-xs"
          />
          <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-1">
            <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
              <path d="M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM4 7.5C4 7.22386 4.22386 7 4.5 7H10.5C10.7761 7 11 7.22386 11 7.5C11 7.77614 10.7761 8 10.5 8H4.5C4.22386 8 4 7.77614 4 7.5ZM5 10.5C5 10.2239 5.22386 10 5.5 10H9.5C9.77614 10 10 10.2239 10 10.5C10 10.7761 9.77614 11 9.5 11H5.5C5.22386 11 5 10.7761 5 10.5Z" fill="currentColor" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full">
          <EventCalendar 
            events={events}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            onEventReceive={handleEventReceive}
          />
        </div>
      </div>
    </div>
  );
};

export default Timetable;