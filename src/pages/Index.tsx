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

  // FIXED: Handle event changes in real-time (drag, resize) with immediate update
  const handleEventChange = (updatedEvent: Event) => {
    console.log('Index: Evento alterado em tempo real', updatedEvent);
    
    // CRITICAL: Update selectedEvent immediately if it's the same event
    if (selectedEvent && selectedEvent.id === updatedEvent.id) {
      console.log('Index: Atualizando selectedEvent em tempo real');
      setSelectedEvent(updatedEvent);
    }
    
    // Também atualizar a lista de eventos existentes
    setExistingEvents(prev => 
      prev.map(event => event.id === updatedEvent.id ? updatedEvent : event)
    );
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

  // ADDED: Handle events list changes from Timetable
  const handleEventsChange = (events: Event[]) => {
    console.log('Index: Lista de eventos atualizada', events.length);
    setExistingEvents(events);
    
    // Update selectedEvent if it still exists in the new events list
    if (selectedEvent) {
      const updatedSelectedEvent = events.find(event => event.id === selectedEvent.id);
      if (updatedSelectedEvent) {
        setSelectedEvent(updatedSelectedEvent);
      } else {
        setSelectedEvent(null); // Event was deleted
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header />
      <main className="flex-1 p-2 md:p-4 min-h-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-2 md:gap-4 h-full">
          {/* Side Panel - Better responsive sizing */}
          <div className="w-full lg:w-80 xl:w-96 2xl:w-[430px] flex-shrink-0 h-[50vh] lg:h-full overflow-hidden">
            <SidePanel 
              selectedEvent={selectedEvent}
              onEventUpdate={handleEventUpdate}
              onEventAdd={handleEventAdd}
              onEventDelete={handleEventDelete}
              onClearSelection={handleClearSelection}
              onEventChange={handleEventChange} // Para mudanças em tempo real
            />
          </div>
          
          {/* Timetable - Takes remaining space */}
          <div className="flex-1 min-w-0 h-[50vh] lg:h-full">
            <Timetable 
              ref={timetableRef}
              onEventClick={handleEventClick}
              onEventChange={handleEventChange} // Para mudanças em tempo real
              onEventsChange={handleEventsChange} // NEW: Para mudanças na lista de eventos
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;