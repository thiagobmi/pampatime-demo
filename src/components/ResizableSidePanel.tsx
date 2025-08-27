// src/components/ResizableSidePanel.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import FilterPanel from './FilterPanel';
import ClassesPanel from './ClassesPanel';
import { Event } from '@/types/Event';

interface ResizableSidePanelProps {
  selectedEvent?: Event | null;
  onEventUpdate?: (event: Event) => void;
  onEventAdd?: (event: Event) => void;
  onEventDelete?: (eventId: string | number) => void;
  onClearSelection?: () => void;
  onEventChange?: (event: Event) => void;
}

const ResizableSidePanel: React.FC<ResizableSidePanelProps> = ({
  selectedEvent,
  onEventUpdate,
  onEventAdd,
  onEventDelete,
  onClearSelection,
  onEventChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [filterPanelHeight, setFilterPanelHeight] = useState(
    selectedEvent ? 420 : 320 // Initial height based on whether we're editing
  );
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number>(0);
  const initialHeight = useRef<number>(0);

  // Update height when selectedEvent changes
  useEffect(() => {
    if (selectedEvent && filterPanelHeight < 380) {
      setFilterPanelHeight(420); // Expand when editing starts
    } else if (!selectedEvent && filterPanelHeight > 360) {
      setFilterPanelHeight(320); // Shrink when not editing
    }
  }, [selectedEvent, filterPanelHeight]);

  // Define limits based on container size
  const getHeightLimits = useCallback(() => {
    if (!containerRef.current) {
      return { min: 250, max: 500 };
    }
    
    const containerHeight = containerRef.current.offsetHeight;
    const minFilterHeight = Math.max(250, containerHeight * 0.25); // At least 25% or 250px
    const maxFilterHeight = Math.min(containerHeight * 0.75, 550); // At most 75% or 550px
    
    return { 
      min: minFilterHeight, 
      max: maxFilterHeight 
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    initialHeight.current = filterPanelHeight;
    
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  }, [filterPanelHeight]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaY = e.clientY - dragStartY.current;
    const newHeight = initialHeight.current + deltaY;
    const { min, max } = getHeightLimits();
    
    // Clamp the height within limits
    const clampedHeight = Math.min(Math.max(newHeight, min), max);
    setFilterPanelHeight(clampedHeight);
  }, [isDragging, getHeightLimits]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Attach global mouse events
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full overflow-hidden min-h-[600px] bg-gray-50 rounded-lg"
    >
      {/* Filter Panel - Resizable */}
      <div 
        style={{ height: `${filterPanelHeight}px` }}
        className="flex-shrink-0 overflow-hidden"
      >
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
      
      {/* Resizable Divider */}
      <div 
        className={`
          flex-shrink-0 h-2 bg-gray-200 border-y border-gray-300 
          cursor-ns-resize group hover:bg-gray-300 transition-colors
          flex items-center justify-center relative
          ${isDragging ? 'bg-blue-300' : ''}
        `}
        onMouseDown={handleMouseDown}
        title="Arrastar para redimensionar"
      >
        {/* Visual indicator */}
        <div className="flex space-x-1">
          <div className="w-8 h-0.5 bg-gray-400 group-hover:bg-gray-500 rounded-full"></div>
          <div className="w-8 h-0.5 bg-gray-400 group-hover:bg-gray-500 rounded-full"></div>
          <div className="w-8 h-0.5 bg-gray-400 group-hover:bg-gray-500 rounded-full"></div>
        </div>
        
        {/* Tooltip on hover */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          Arrastar para redimensionar painéis
        </div>
      </div>
      
      {/* Classes Panel - Takes remaining space */}
      <div className="flex-1 min-h-[150px] overflow-hidden">
        <ClassesPanel />
      </div>
    </div>
  );
};

export default ResizableSidePanel;