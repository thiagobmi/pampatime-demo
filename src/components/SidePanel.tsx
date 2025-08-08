// src/components/SidePanel.tsx
import React from 'react';
import FilterPanel from './FilterPanel';
import ClassesPanel from './ClassesPanel';
import { Event } from '@/types/Event';

interface SidePanelProps {
  selectedEvent?: Event | null;
  existingEvents?: Event[]; // Nova prop para passar eventos existentes
  onEventUpdate?: (event: Event) => void;
  onEventAdd?: (event: Event) => void;
  onEventDelete?: (eventId: string | number) => void;
  onClearSelection?: () => void;
  onEventChange?: (event: Event) => void; // Nova prop para mudanças em tempo real
}

const SidePanel: React.FC<SidePanelProps> = ({
  selectedEvent,
  existingEvents = [], // Default para array vazio
  onEventUpdate,
  onEventAdd,
  onEventDelete,
  onClearSelection,
  onEventChange // Nova prop
}) => {
  return (
    <div className="flex flex-col h-full space-y-3 overflow-hidden">
      <div className="flex-shrink-0">
        <FilterPanel 
          selectedEvent={selectedEvent}
          onEventUpdate={onEventUpdate}
          onEventAdd={onEventAdd}
          onEventDelete={onEventDelete}
          onClearSelection={onClearSelection}
          onEventChange={onEventChange} // Passando para o FilterPanel
        />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <ClassesPanel existingEvents={existingEvents} />
      </div>
    </div>
  );
};

export default SidePanel;