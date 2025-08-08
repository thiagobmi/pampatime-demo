import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { EventCalendar } from './EventCalendar';
import { getEventTypeColors } from '@/types/Event';

interface Event {
  id?: string | number;
  title: string;
  start?: Date | string;
  end?: Date | string;
  room?: string;
  professor?: string;
  semester?: string;
  class?: string;
  type?: string;
  backgroundColor?: string;
  borderColor?: string;
}

interface TimetableProps {
  onEventClick?: (event: Event) => void;
  onEventChange?: (event: Event) => void;
  onEventsChange?: (events: Event[]) => void; // Nova prop para notificar mudanças na lista de eventos
}

interface TimetableRef {
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string | number) => void;
  getEvents: () => Event[]; // Nova função para obter eventos
}

const Timetable = forwardRef<TimetableRef, TimetableProps>(({ onEventClick, onEventChange, onEventsChange }, ref) => {
  // Events state
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | number | null>(null);
  const processedEventsRef = useRef(new Set<string>()); // Track processed events
  
  console.log('Eventos:', events);

  // Notify parent when events change
  const notifyEventsChange = (newEvents: Event[]) => {
    if (onEventsChange) {
      onEventsChange(newEvents);
    }
  };

// Nova função para adicionar evento via clique
  const addEventViaClick = (eventData: any) => {
    console.log('=== ADICIONANDO VIA CLIQUE ===');
    console.log('Dados do evento:', eventData);
    
    const newEventId = `event-${Date.now()}-${Math.random()}`;
    const colors = getEventTypeColors(eventData.extendedProps?.type || '');
    
    // Criar evento com horário padrão (próximo slot disponível)
    const now = new Date();
    const startDate = new Date(2020, 0, 6, 8, 30, 0); // Segunda 8:30
    const endDate = new Date(2020, 0, 6, 9, 30, 0); // Segunda 9:30
    
    const newEvent: Event = {
      id: newEventId,
      title: eventData.title,
      start: startDate,
      end: endDate,
      room: eventData.extendedProps?.room || '',
      professor: eventData.extendedProps?.professor || '',
      semester: eventData.extendedProps?.semester || '',
      class: eventData.extendedProps?.class || '',
      type: eventData.extendedProps?.type || '',
      backgroundColor: colors.bg,
      borderColor: colors.border,
    };

    console.log('NOVO EVENTO CRIADO:', newEvent);

    setEvents(prevEvents => {
      const updatedEvents = [...prevEvents, newEvent];
      notifyEventsChange(updatedEvents);
      return updatedEvents;
    });

    // Auto selecionar para edição
    if (onEventClick) {
      onEventClick(newEvent);
    }
  };

  // Helper function to create event data from FullCalendar event
  const createEventDataFromFullCalendar = (fcEvent: any): Event => {
    return {
      id: fcEvent.id,
      title: fcEvent.title,
      start: fcEvent.start,
      end: fcEvent.end,
      room: fcEvent.extendedProps?.room,
      professor: fcEvent.extendedProps?.professor,
      semester: fcEvent.extendedProps?.semester,
      class: fcEvent.extendedProps?.class,
      type: fcEvent.extendedProps?.type,
      backgroundColor: fcEvent.backgroundColor,
      borderColor: fcEvent.borderColor,
    };
  };

  // Handle event click - pass the event data to parent
  const handleEventClick = (info: any) => {
    console.log('Evento clicado:', info.event);
    
    const eventData = createEventDataFromFullCalendar(info.event);
    setSelectedEventId(eventData.id);
    
    if (onEventClick) {
      onEventClick(eventData);
    }
  };

  const handleEventDrop = (info: any) => {
    console.log('Evento movido:', info.event);
    
    // Atualizar o estado interno
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => 
        event.id === info.event.id 
          ? {
              ...event,
              start: info.event.start,
              end: info.event.end
            }
          : event
      );
      notifyEventsChange(updatedEvents);
      return updatedEvents;
    });

    // Se este evento está selecionado, notificar mudança em tempo real
    if (selectedEventId === info.event.id && onEventChange) {
      const updatedEventData = createEventDataFromFullCalendar(info.event);
      console.log('Notificando mudança em tempo real:', updatedEventData);
      onEventChange(updatedEventData);
    }
  };

  const handleEventResize = (info: any) => {
    console.log('Evento redimensionado:', info.event);
    
    // Atualizar o estado interno
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => 
        event.id === info.event.id 
          ? {
              ...event,
              start: info.event.start,
              end: info.event.end
            }
          : event
      );
      notifyEventsChange(updatedEvents);
      return updatedEvents;
    });

    // Se este evento está selecionado, notificar mudança em tempo real
    if (selectedEventId === info.event.id && onEventChange) {
      const updatedEventData = createEventDataFromFullCalendar(info.event);
      console.log('Notificando redimensionamento em tempo real:', updatedEventData);
      onEventChange(updatedEventData);
    }
  };

  // Novo handler para capturar durante o drag (em tempo real)
  const handleEventDragStart = (info: any) => {
    console.log('Iniciou drag do evento:', info.event);
    setSelectedEventId(info.event.id);
  };

  const handleEventDragStop = (info: any) => {
    console.log('Finalizou drag do evento:', info.event);
    
    // Notificar mudança final
    if (onEventChange) {
      const updatedEventData = createEventDataFromFullCalendar(info.event);
      onEventChange(updatedEventData);
    }
  };

  // Novo handler para capturar durante resize
  const handleEventResizeStart = (info: any) => {
    console.log('Iniciou resize do evento:', info.event);
    setSelectedEventId(info.event.id);
  };

  const handleEventResizeStop = (info: any) => {
    console.log('Finalizou resize do evento:', info.event);
    
    // Notificar mudança final
    if (onEventChange) {
      const updatedEventData = createEventDataFromFullCalendar(info.event);
      onEventChange(updatedEventData);
    }
  };

  const handleEventReceive = (info: any) => {
    console.log('=== EVENTO ARRASTADO RECEBIDO ===');
    
    // Prevent FullCalendar from auto-adding the event
    // We'll handle it manually to avoid duplications
    const eventData = {
      title: info.event.title,
      start: info.event.start,
      end: info.event.end || new Date(info.event.start.getTime() + 60*60*1000),
      extendedProps: info.event.extendedProps || {}
    };
    
    console.log('Dados extraídos:', eventData);
    
    // Remove the auto-created event to prevent duplicates
    info.event.remove();
    
    // Create our controlled event
    const newEventId = `event-${Date.now()}-${Math.random()}`;
    const colors = getEventTypeColors(eventData.extendedProps?.type || '');
    
    const newEvent: Event = {
      id: newEventId,
      title: eventData.title,
      start: eventData.start,
      end: eventData.end,
      room: eventData.extendedProps?.room || '',
      professor: eventData.extendedProps?.professor || '',
      semester: eventData.extendedProps?.semester || '',
      class: eventData.extendedProps?.class || '',
      type: eventData.extendedProps?.type || '',
      backgroundColor: colors.bg,
      borderColor: colors.border,
    };

    console.log('Adicionando evento único:', newEvent);

    // Add to state (this will trigger re-render and show the event)
    setEvents(prevEvents => {
      const updatedEvents = [...prevEvents, newEvent];
      notifyEventsChange(updatedEvents);
      return updatedEvents;
    });

    // Auto-select for editing
    if (onEventClick) {
      // Small delay to ensure state update completed
      setTimeout(() => {
        onEventClick(newEvent);
      }, 100);
    }
  };

  // Function to add event from form
  const addEvent = (event: Event) => {
    console.log('Adicionando evento:', event);
    setEvents(prevEvents => {
      const updatedEvents = [...prevEvents, event];
      notifyEventsChange(updatedEvents);
      return updatedEvents;
    });
  };

  // Function to update event
  const updateEvent = (updatedEvent: Event) => {
    console.log('Atualizando evento:', updatedEvent);
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      );
      notifyEventsChange(updatedEvents);
      return updatedEvents;
    });
  };

  // Function to delete event
  const deleteEvent = (eventId: string | number) => {
    console.log('Deletando evento:', eventId);
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.filter(event => event.id !== eventId);
      notifyEventsChange(updatedEvents);
      return updatedEvents;
    });
    
    // Se o evento deletado estava selecionado, limpar seleção
    if (selectedEventId === eventId) {
      setSelectedEventId(null);
    }
  };

  // Function to get current events
  const getEvents = () => {
    return events;
  };

  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    addEvent,
    updateEvent,
    deleteEvent,
    getEvents
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
            // Novos handlers para capturar mudanças em tempo real
            onEventDragStart={handleEventDragStart}
            onEventDragStop={handleEventDragStop}
            onEventResizeStart={handleEventResizeStart}
            onEventResizeStop={handleEventResizeStop}
          />
        </div>
      </div>
    </div>
  );
});

Timetable.displayName = 'Timetable';

export default Timetable;