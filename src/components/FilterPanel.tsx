import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import SearchableFilter from './SearchableFilter';

const FilterPanel = () => {
  // State to track selected values
  const [filters, setFilters] = useState({
    professor: '',
    semestre: '',
    horarioInicio: '',
    horarioFinal: '',
    sala: '',
    dia: '',
    turma: '',
    disciplina: ''
  });

  // Function to convert time string to minutes for comparison
  const timeToMinutes = (timeString) => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Function to get available end times based on start time
  const getAvailableEndTimes = () => {
    if (!filters.horarioInicio) return [];
    
    const startMinutes = timeToMinutes(filters.horarioInicio);
    const minEndMinutes = startMinutes + 60; // At least 1 hour later
    
    // Generate all possible times
    const allTimes = [];
    for (let hour = 7; hour <= 22; hour++) {
      allTimes.push(`${hour.toString().padStart(2, '0')}:30`);
      if (hour < 22) {
        allTimes.push(`${(hour + 1).toString().padStart(2, '0')}:00`);
      }
    }
    
    // Filter times that are at least 1 hour after start time
    return allTimes.filter(time => timeToMinutes(time) >= minEndMinutes);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: value
      };
      
      // If start time changed, clear end time if it's now invalid
      if (filterType === 'horarioInicio' && prev.horarioFinal) {
        const startMinutes = timeToMinutes(value);
        const endMinutes = timeToMinutes(prev.horarioFinal);
        if (endMinutes < startMinutes + 60) {
          newFilters.horarioFinal = '';
        }
      }
      
      return newFilters;
    });
    console.log(`${filterType} changed to:`, value);
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
      <div className="space-y-2 mb-3">
        <div className="grid grid-cols-2 gap-2">
          <SearchableFilter 
            label="Professor" 
            onSelect={(value) => handleFilterChange('professor', value)}
          />
          <SearchableFilter 
            label="Semestre" 
            onSelect={(value) => handleFilterChange('semestre', value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <SearchableFilter 
            label="Horário Início" 
            onSelect={(value) => handleFilterChange('horarioInicio', value)}
          />
          <SearchableFilter 
            label="Horário Final" 
            options={getAvailableEndTimes()}
            onSelect={(value) => handleFilterChange('horarioFinal', value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <SearchableFilter 
            label="Sala" 
            onSelect={(value) => handleFilterChange('sala', value)}
          />
          <SearchableFilter 
            label="Dia" 
            onSelect={(value) => handleFilterChange('dia', value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <SearchableFilter 
            label="Turma" 
            onSelect={(value) => handleFilterChange('turma', value)}
          />
          <SearchableFilter 
            label="Disciplina" 
            className="w-full" 
            onSelect={(value) => handleFilterChange('disciplina', value)}
          />
        </div>
      </div>
             
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm" className="text-xs bg-white font-medium">
          Adicionar
        </Button>
        <Button variant="outline" size="sm" className="text-xs bg-white font-medium">
          Editar
        </Button>
        <Button variant="outline" size="sm" className="text-xs bg-white font-medium">
          Excluir
        </Button>
      </div>
      
      {/* Debug info - remove in production */}
      {filters.horarioInicio && (
        <div className="mt-2 text-xs text-gray-500">
          Horário selecionado: {filters.horarioInicio} - {filters.horarioFinal || 'Selecione o horário final'}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;