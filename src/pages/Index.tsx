// src/pages/Index.tsx
import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import SidePanel from '@/components/SidePanel';
import Timetable from '@/components/Timetable';
import { Event } from '@/types/Event';

const Index = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const timetableRef = useRef<any>(null);

  // Handle event click from calendar
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  // Handle event update from form
  const handleEventUpdate = (updatedEvent: Event) => {
    // Update the event in the calendar
    if (timetableRef.current && timetableRef.current.updateEvent) {
      timetableRef.current.updateEvent(updatedEvent);
    }
    // Clear selection after update
    setSelectedEvent(null);
  };

  // Handle event add from form
  const handleEventAdd = (newEvent: Event) => {
    // Add the event to the calendar
    if (timetableRef.current && timetableRef.current.addEvent) {
      timetableRef.current.addEvent(newEvent);
    }
  };

  // Handle event delete from form
  const handleEventDelete = (eventId: string | number) => {
    // Delete the event from the calendar
    if (timetableRef.current && timetableRef.current.deleteEvent) {
      timetableRef.current.deleteEvent(eventId);
    }
    // Clear selection after delete
    setSelectedEvent(null);
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Navbar />
      
      <main className="flex-1 p-2 md:p-4 min-h-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-4 h-full">
          <div className="lg:col-span-1 h-full overflow-auto">
            <SidePanel 
              selectedEvent={selectedEvent}
              onEventUpdate={handleEventUpdate}
              onEventAdd={handleEventAdd}
              onEventDelete={handleEventDelete}
              onClearSelection={handleClearSelection}
            />
          </div>
          
          <div className="lg:col-span-3 h-full">
            <Timetable 
              ref={timetableRef}
              onEventClick={handleEventClick}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;