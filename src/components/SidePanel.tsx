// src/components/SidePanel.tsx
import React from 'react';
import FilterPanel from './FilterPanel';
import ClassesPanel from './ClassesPanel';
import { Event } from '@/types/Event';

interface SidePanelProps {
  selectedEvent?: Event | null;
  onEventUpdate?: (event: Event) => void;
  onEventAdd?: (event: Event) => void;
  onEventDelete?: (eventId: string | number) => void;
  onClearSelection?: () => void;
  onEventChange?: (event: Event) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  selectedEvent,
  onEventUpdate,
  onEventAdd,
  onEventDelete,
  onClearSelection,
  onEventChange
}) => {
  return (
    <div className="flex flex-col h-full space-y-3 overflow-hidden min-h-[600px]">
      {/* Filter Panel - Dynamic size based on content, but with limits */}
      <div className={`flex-shrink-0 overflow-hidden ${
        selectedEvent 
          ? 'max-h-[420px] lg:max-h-[450px]' // When editing, take more space
          : 'max-h-[320px] lg:max-h-[350px]' // When not editing, take less space
      }`}>
        <div className="h-full overflow-y-auto">
          <FilterPanel 
            selectedEvent={selectedEvent}
            onEventUpdate={onEventUpdate}
            onEventAdd={onEventAdd}
            onEventDelete={onEventDelete}
            onClearSelection={onClearSelection}
            onEventChange={onEventChange}
          />
        </div>
      </div>
      
      {/* Classes Panel - Takes remaining space with guaranteed minimum */}
      <div className="flex-1 min-h-[200px] overflow-hidden">
        <ClassesPanel />
      </div>
    </div>
  );
};

export default SidePanel;