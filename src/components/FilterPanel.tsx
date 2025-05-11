import React from 'react';
import { Button } from "@/components/ui/button";
import FilterDropdown from './FilterDropdown';

const FilterPanel = () => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="space-y-2 mb-4">
        <div className="grid grid-cols-2 gap-2">
          <FilterDropdown label="Professor" />
          <FilterDropdown label="Semestre" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FilterDropdown label="Horário" />
          <FilterDropdown label="Sala" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FilterDropdown label="Dia" />
          <FilterDropdown label="Turma" />
        </div>
        <FilterDropdown label="Disciplina" className="w-full" />
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm" className="text-xs bg-white font-medium">Adicionar</Button>
        <Button variant="outline" size="sm" className="text-xs bg-white font-medium">Editar</Button>
        <Button variant="outline" size="sm" className="text-xs bg-white font-medium">Excluir</Button>
      </div>
    </div>
  );
};

export default FilterPanel;