import React, { forwardRef, useImperativeHandle } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { EventCalendar } from './EventCalendar';

interface Event {
  id?: string | number;
  title: string;
  start?: Date | string;
  end?: Date | string;
  room?: string;
  professor?: string;
  semester?: string;  // Adicionado campo semestre
  class?: string;     // Adicionado campo turma
  type?: string;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: {
    room?: string;
    professor?: string;
    type?: string;
    roomInfo?: string;
    semester?: string;
    class?: string;
  };
}

interface TimetableProps {
  onEventClick?: (event: Event) => void;
}

interface TimetableRef {
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string | number) => void;
}

const Timetable = forwardRef<TimetableRef, TimetableProps>(({ onEventClick }, ref) => {
  // Events state
  const [events, setEvents] = useState<Event[]>([]);
  console.log('Eventos:', events);

  // Handle event click - pass the event data to parent
  const handleEventClick = (info: any) => {
    console.log('Evento clicado:', info.event);
    
    // Corrigido: Extrair todas as propriedades do evento, incluindo semestre e turma
    const eventData: Event = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      room: info.event.extendedProps?.room,
      professor: info.event.extendedProps?.professor,
      semester: info.event.extendedProps?.semester,  // Adicionado
      class: info.event.extendedProps?.class,        // Adicionado
      type: info.event.extendedProps?.type,
      backgroundColor: info.event.backgroundColor,
      borderColor: info.event.borderColor,
      extendedProps: info.event.extendedProps
    };
    
    console.log('Dados do evento passados para edição:', eventData);
    
    if (onEventClick) {
      onEventClick(eventData);
    }
  };

  const handleEventDrop = (info: any) => {
    console.log('Evento movido:', info.event);
    const updatedEvents = [...events];
    const eventIndex = updatedEvents.findIndex(e => e.id === info.event.id);
    
    if (eventIndex !== -1) {
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        start: info.event.start,
        end: info.event.end
      };
      setEvents(updatedEvents);
    }
  };

  const handleEventResize = (info: any) => {
    console.log('Evento redimensionado:', info.event);
    const updatedEvents = [...events];
    const eventIndex = updatedEvents.findIndex(e => e.id === info.event.id);
    
    if (eventIndex !== -1) {
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        end: info.event.end
      };
      setEvents(updatedEvents);
    }
  };

  const handleEventReceive = (info: any) => {
    console.log('Evento recebido:', info.event);
    const newEvent: Event = {
      id: info.event.id || `event-${Date.now()}`,
      title: info.event.title || 'New Event',
      start: info.event.start,
      end: info.event.end,
      room: info.event.extendedProps?.room,
      professor: info.event.extendedProps?.professor,
      semester: info.event.extendedProps?.semester,  // Adicionado
      class: info.event.extendedProps?.class,        // Adicionado
      type: info.event.extendedProps?.type,
      backgroundColor: info.event.backgroundColor || '#3788d8',
      borderColor: info.event.borderColor || '#3788d8',
      extendedProps: info.event.extendedProps
    };

    setEvents(prevEvents => [...prevEvents, newEvent]);
  };

  // Function to add event from form
  const addEvent = (event: Event) => {
    console.log('Adicionando evento:', event);
    setEvents(prevEvents => [...prevEvents, event]);
  };

  // Function to update event
  const updateEvent = (updatedEvent: Event) => {
    console.log('Atualizando evento:', updatedEvent);
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  // Function to delete event
  const deleteEvent = (eventId: string | number) => {
    console.log('Deletando evento:', eventId);
    setEvents(prevEvents => 
      prevEvents.filter(event => event.id !== eventId)
    );
  };

  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    addEvent,
    updateEvent,
    deleteEvent
  }));

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
});

Timetable.displayName = 'Timetable';

export default Timetable;