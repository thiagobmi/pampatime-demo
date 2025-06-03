// src/components/FilterPanel.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import SearchableFilter from './SearchableFilter';
import { Event, createEventWithFixedDate, getEventTypeColors, getFixedDateForDay } from '@/types/Event';

interface FilterPanelProps {
  selectedEvent?: Event | null;
  onEventUpdate?: (event: Event) => void;
  onEventAdd?: (event: Event) => void;
  onEventDelete?: (eventId: string | number) => void;
  onClearSelection?: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedEvent,
  onEventUpdate,
  onEventAdd,
  onEventDelete,
  onClearSelection
}) => {
  // State to track form values
  const [formData, setFormData] = useState({
    title: '',
    professor: '',
    semestre: '',
    horarioInicio: '',
    horarioFinal: '',
    sala: '',
    dia: '',
    turma: '',
    disciplina: '',
    type: 'math' as const
  });

  // Update form when selectedEvent changes
  useEffect(() => {
    if (selectedEvent) {
      const startTime = selectedEvent.start ? new Date(selectedEvent.start) : null;
      const endTime = selectedEvent.end ? new Date(selectedEvent.end) : null;

      setFormData({
        title: selectedEvent.title || '',
        professor: selectedEvent.professor || '',
        semestre: selectedEvent.semester || '',    // Corrigido: usar semester do evento
        horarioInicio: startTime ? formatTimeForInput(startTime) : '',
        horarioFinal: endTime ? formatTimeForInput(endTime) : '',
        sala: selectedEvent.room || '',
        dia: startTime ? getDayNameFromFixedDate(startTime) : '',
        turma: selectedEvent.class || '',          // Corrigido: usar class do evento
        disciplina: selectedEvent.title || '',
        type: (selectedEvent.type as any) || 'math'
      });
    } else {
      // Clear form when no event is selected
      setFormData({
        title: '',
        professor: '',
        semestre: '',
        horarioInicio: '',
        horarioFinal: '',
        sala: '',
        dia: '',
        turma: '',
        disciplina: '',
        type: 'math'
      });
    }
  }, [selectedEvent]);

  const formatTimeForInput = (date: Date): string => {
    return date.toTimeString().slice(0, 5); // HH:MM format
  };

  const getDayNameFromFixedDate = (date: Date): string => {
    const dayOfWeek = date.getDay();
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayOfWeek];
  };

  // Function to convert time string to minutes for comparison
  const timeToMinutes = (timeString: string) => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Function to get available end times based on start time
  const getAvailableEndTimes = () => {
    if (!formData.horarioInicio) return [];

    const startMinutes = timeToMinutes(formData.horarioInicio);
    const minEndMinutes = startMinutes + 60; // At least 1 hour later

    // Generate all possible half-hour times
    const allTimes = [];
    for (let hour = 7; hour <= 22; hour++) {
      allTimes.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    // Filter times that are at least 1 hour after start time
    return allTimes.filter(time => timeToMinutes(time) >= minEndMinutes);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };

      // If start time changed, clear end time if it's now invalid
      if (field === 'horarioInicio' && prev.horarioFinal) {
        const startMinutes = timeToMinutes(value);
        const endMinutes = timeToMinutes(prev.horarioFinal);
        if (endMinutes < startMinutes + 60) {
          newData.horarioFinal = '';
        }
      }

      // Update title when disciplina changes
      if (field === 'disciplina') {
        newData.title = value;
      }

      return newData;
    });
  };

  const handleAdd = () => {
    if (selectedEvent){
      return alert('Por favor, cancele a edição atual antes de adicionar um novo evento.');
    }

    if (!formData.title || !formData.horarioInicio || !formData.horarioFinal || !formData.dia) {
      alert('Por favor, preencha todos os campos obrigatórios (Disciplina, Horário Início, Horário Final, Dia)');
      return;
    }

    // Use the unified event creation function with all fields
    const newEvent = createEventWithFixedDate(
      formData.title,
      formData.dia,
      formData.horarioInicio,
      formData.horarioFinal,
      {
        room: formData.sala,
        professor: formData.professor,
        semester: formData.semestre,    // Incluído semestre
        class: formData.turma,          // Incluído turma
        type: formData.type,
        id: `event-${Date.now()}`
      }
    );

    if (onEventAdd) {
      onEventAdd(newEvent);
    }

    // Clear form after adding
    setFormData({
      title: '',
      professor: '',
      semestre: '',
      horarioInicio: '',
      horarioFinal: '',
      sala: '',
      dia: '',
      turma: '',
      disciplina: '',
      type: 'math'
    });
  };

  const handleEdit = () => {
    if (!selectedEvent || !formData.title) {
      alert('Selecione um evento e preencha os campos necessários');
      return;
    }

    // Create updated event using the unified function with all fields
    const updatedEvent = createEventWithFixedDate(
      formData.title,
      formData.dia,
      formData.horarioInicio,
      formData.horarioFinal,
      {
        room: formData.sala,
        professor: formData.professor,
        semester: formData.semestre,    // Incluído semestre na edição
        class: formData.turma,          // Incluído turma na edição
        type: formData.type,
        id: selectedEvent.id
      }
    );

    if (onEventUpdate) {
      onEventUpdate(updatedEvent);
    }
  };

  const handleDelete = () => {
    if (!selectedEvent) {
      alert('Selecione um evento para excluir');
      return;
    }

    if (confirm('Tem certeza que deseja excluir este evento?')) {
      if (onEventDelete && selectedEvent.id) {
        onEventDelete(selectedEvent.id);
      }
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
      {selectedEvent && (
        <div className="mb-3 p-2 bg-blue-50 rounded border-l-4 border-blue-500">
          <div className="text-sm font-medium text-blue-800">Editando Evento</div>
          <div className="text-xs text-blue-600">{selectedEvent.title}</div>
          {/* Mostrar semestre e turma se disponíveis */}
          {(selectedEvent.semester || selectedEvent.class) && (
            <div className="text-xs text-blue-500 mt-1">
              {selectedEvent.semester && `Semestre: ${selectedEvent.semester}`}
              {selectedEvent.semester && selectedEvent.class && ' • '}
              {selectedEvent.class && `Turma: ${selectedEvent.class}`}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="mt-1 h-6 px-2 text-xs"
          >
            Cancelar Edição
          </Button>
        </div>
      )}

      <div className="space-y-2 mb-3">
        <div className="grid grid-cols-2 gap-2">
          <SearchableFilter
            label="Professor"
            value={formData.professor}
            onSelect={(value) => handleFieldChange('professor', value)}
          />
          <SearchableFilter
            label="Semestre"
            value={formData.semestre}
            onSelect={(value) => handleFieldChange('semestre', value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <SearchableFilter
            label="Horário Início"
            value={formData.horarioInicio}
            onSelect={(value) => handleFieldChange('horarioInicio', value)}
          />
          <SearchableFilter
            label="Horário Final"
            value={formData.horarioFinal}
            options={getAvailableEndTimes()}
            onSelect={(value) => handleFieldChange('horarioFinal', value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <SearchableFilter
            label="Sala"
            value={formData.sala}
            onSelect={(value) => handleFieldChange('sala', value)}
          />
          <SearchableFilter
            label="Dia"
            value={formData.dia}
            onSelect={(value) => handleFieldChange('dia', value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <SearchableFilter
            label="Turma"
            value={formData.turma}
            onSelect={(value) => handleFieldChange('turma', value)}
          />
          <SearchableFilter
            label="Disciplina"
            value={formData.disciplina}
            className="w-full"
            onSelect={(value) => handleFieldChange('disciplina', value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs bg-white font-medium hover:bg-green-50"
          onClick={handleAdd}
        >
          Adicionar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs bg-white font-medium hover:bg-blue-50"
          onClick={handleEdit}
          disabled={!selectedEvent}
        >
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs bg-white font-medium hover:bg-red-50"
          onClick={handleDelete}
          disabled={!selectedEvent}
        >
          Excluir
        </Button>
      </div>

      {/* Debug info - remove in production */}
      {formData.horarioInicio && (
        <div className="mt-2 text-xs text-gray-500">
          Horário selecionado: {formData.horarioInicio} - {formData.horarioFinal || 'Selecione o horário final'}
          {formData.semestre && ` • Semestre: ${formData.semestre}`}
          {formData.turma && ` • Turma: ${formData.turma}`}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;