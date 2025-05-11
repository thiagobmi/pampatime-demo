import React from 'react';
import FilterPanel from './FilterPanel';
import ClassesPanel from './ClassesPanel';

const SidePanel = () => {
  return (
    <div className="flex flex-col h-full">
      <FilterPanel />
      <div className="h-4"></div> {/* Espaçamento entre os componentes */}
      <div className="flex-1">
        <ClassesPanel />
      </div>
    </div>
  );
};

export default SidePanel;