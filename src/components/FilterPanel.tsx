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

// Internal form state interface
interface FormState {
  title: string;
  professor: string;
  semestre: string;
  horarioInicio: string;
  horarioFinal: string;
  sala: string;
  dia: string;
  turma: string;
  type: string; // This should be separate from title
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedEvent,
  onEventUpdate,
  onEventAdd,
  onEventDelete,
  onClearSelection
}) => {
  // State to track form values
  const [formData, setFormData] = useState<FormState>({
    title: '',
    professor: '',
    semestre: '',
    horarioInicio: '',
    horarioFinal: '',
    sala: '',
    dia: '',
    turma: '',
    type: '' // Default empty, user should select this separately
  });

  // Update form when selectedEvent changes
  useEffect(() => {
    if (selectedEvent) {
      const startTime = selectedEvent.start ? new Date(selectedEvent.start) : null;
      const endTime = selectedEvent.end ? new Date(selectedEvent.end) : null;

      setFormData({
        title: selectedEvent.title || '',
        professor: selectedEvent.professor || '',
        semestre: selectedEvent.semester || '',
        horarioInicio: startTime ? formatTimeForInput(startTime) : '',
        horarioFinal: endTime ? formatTimeForInput(endTime) : '',
        sala: selectedEvent.room || '',
        dia: startTime ? getDayNameFromFixedDate(startTime) : '',
        turma: selectedEvent.class || '',
        type: selectedEvent.type || '' // Keep the existing type
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
        type: ''
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
  const timeToMinutes = (timeString: string): number => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Function to get available end times based on start time
  const getAvailableEndTimes = (): string[] => {
    if (!formData.horarioInicio) return [];

    const startMinutes = timeToMinutes(formData.horarioInicio);
    const minEndMinutes = startMinutes + 60; // At least 1 hour later

    // Generate all possible half-hour times
    const allTimes: string[] = [];
    for (let hour = 7; hour <= 22; hour++) {
      allTimes.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    // Filter times that are at least 1 hour after start time
    return allTimes.filter(time => timeToMinutes(time) >= minEndMinutes);
  };

  const handleFieldChange = (field: keyof FormState, value: string) => {
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

      // DO NOT automatically update title when type changes
      // Title and type should be independent

      return newData;
    });
  };

  const handleAdd = () => {
    if (selectedEvent) {
      return alert('Por favor, cancele a edição atual antes de adicionar um novo evento.');
    }

    if (!formData.title || !formData.horarioInicio || !formData.horarioFinal || !formData.dia) {
      alert('Por favor, preencha todos os campos obrigatórios (Título, Horário Início, Horário Final, Dia)');
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
        semester: formData.semestre,
        class: formData.turma,
        type: formData.type, // Type is separate from title
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
      type: ''
    });
  };

  const handleEdit = () => {
    if (!selectedEvent || !formData.title) {
      alert('Selecione um evento e preencha os campos necessários');
      return;
    }

    if (!formData.horarioInicio || !formData.horarioFinal || !formData.dia) {
      alert('Por favor, preencha os campos obrigatórios (Horário Início, Horário Final, Dia)');
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
        semester: formData.semestre,
        class: formData.turma,
        type: formData.type, // Type is separate from title
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
        {/* Title as first field - editable input */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1 text-gray-700">Nome</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="Digite o título do evento"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md cursor-text hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        
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
            label="Tipo"
            value={formData.type}
            onSelect={(value) => handleFieldChange('type', value)}
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
    </div>
  );
};

export default FilterPanel;