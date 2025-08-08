// src/pages/Index.tsx
import React, { useState, useRef, useEffect } from 'react';
import SidePanel from '@/components/SidePanel';
import Timetable from '@/components/Timetable';
import { Event } from '@/types/Event';
import Header from '@/components/Header';

const Index = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [existingEvents, setExistingEvents] = useState<Event[]>([]);
  const timetableRef = useRef<any>(null);

  // Atualizar a lista de eventos existentes sempre que o calendário mudar
  useEffect(() => {
    const updateExistingEvents = () => {
      if (timetableRef.current && timetableRef.current.getEvents) {
        const events = timetableRef.current.getEvents();
        setExistingEvents(events);
      }
    };

    // Pequeno delay para garantir que o componente está montado
    const timer = setTimeout(updateExistingEvents, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle event click from calendar
  const handleEventClick = (event: Event) => {
    console.log('Index: Evento clicado', event);
    setSelectedEvent(event);
  };

  // Handle event changes in real-time (drag, resize)
  const handleEventChange = (updatedEvent: Event) => {
    console.log('Index: Evento alterado em tempo real', updatedEvent);
    
    // Atualizar o selectedEvent se for o mesmo evento
    if (selectedEvent && selectedEvent.id === updatedEvent.id) {
      setSelectedEvent(updatedEvent);
    }
    
    // Também atualizar no Timetable
    if (timetableRef.current && timetableRef.current.updateEvent) {
      timetableRef.current.updateEvent(updatedEvent);
    }
  };

  // Handle event update from form
  const handleEventUpdate = (updatedEvent: Event) => {
    console.log('Index: Atualizando evento via formulário', updatedEvent);
    
    // Update the event in the calendar
    if (timetableRef.current && timetableRef.current.updateEvent) {
      timetableRef.current.updateEvent(updatedEvent);
    }
    
    // Atualizar lista de eventos existentes
    setExistingEvents(prev => 
      prev.map(event => event.id === updatedEvent.id ? updatedEvent : event)
    );
    
    // Clear selection after update
    setSelectedEvent(null);
  };

  // Handle event add from form
  const handleEventAdd = (newEvent: Event) => {
    console.log('Index: Adicionando novo evento', newEvent);
    
    // Add the event to the calendar
    if (timetableRef.current && timetableRef.current.addEvent) {
      timetableRef.current.addEvent(newEvent);
    }
    
    // Atualizar lista de eventos existentes
    setExistingEvents(prev => [...prev, newEvent]);
  };

  // Handle event delete from form
  const handleEventDelete = (eventId: string | number) => {
    console.log('Index: Deletando evento', eventId);
    
    // Delete the event from the calendar
    if (timetableRef.current && timetableRef.current.deleteEvent) {
      timetableRef.current.deleteEvent(eventId);
    }
    
    // Atualizar lista de eventos existentes
    setExistingEvents(prev => prev.filter(event => event.id !== eventId));
    
    // Clear selection after delete
    setSelectedEvent(null);
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header />
      <main className="flex-1 p-2 md:p-4 min-h-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-4 h-full">
          <div className="lg:col-span-1 h-full overflow-auto">
            <SidePanel 
              selectedEvent={selectedEvent}
              existingEvents={existingEvents}
              onEventUpdate={handleEventUpdate}
              onEventAdd={handleEventAdd}
              onEventDelete={handleEventDelete}
              onClearSelection={handleClearSelection}
              onEventChange={handleEventChange} // Nova prop para mudanças em tempo real
            />
          </div>
          
          <div className="lg:col-span-3 h-full">
            <Timetable 
              ref={timetableRef}
              onEventClick={handleEventClick}
              onEventChange={handleEventChange} // Nova prop para mudanças em tempo real
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;