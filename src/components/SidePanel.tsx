import React from 'react';
import FilterPanel from './FilterPanel';
import ClassesPanel from './ClassesPanel';

const SidePanel = () => {
  return (
    <div className="flex flex-col h-full space-y-3 overflow-hidden">
      <div className="flex-shrink-0">
        <FilterPanel />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <ClassesPanel />
      </div>
    </div>
  );
};

export default SidePanel;