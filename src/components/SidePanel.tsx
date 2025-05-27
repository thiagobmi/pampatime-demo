import React from 'react';
import FilterPanel from './FilterPanel';
import ClassesPanel from './ClassesPanel';

interface Event {
  id?: string | number;
  title: string;
  start?: Date | string;
  end?: Date | string;
  room?: string;
  professor?: string;
  type?: string;
  backgroundColor?: string;
  borderColor?: string;
}

interface SidePanelProps {
  selectedEvent?: Event | null;
  onEventUpdate?: (event: Event) => void;
  onEventAdd?: (event: Event) => void;
  onEventDelete?: (eventId: string | number) => void;
  onClearSelection?: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  selectedEvent,
  onEventUpdate,
  onEventAdd,
  onEventDelete,
  onClearSelection
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
        />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <ClassesPanel />
      </div>
    </div>
  );
};

export default SidePanel;