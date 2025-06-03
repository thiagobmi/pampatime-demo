import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import SearchableFilter from './SearchableFilter';
import { X, Calendar, Clock, MapPin, User, BookOpen, Users } from 'lucide-react';

interface Event {
  id?: number;
  title: string;
  start: string;
  end?: string;
  room?: string;
  professor?: string;
  semester?: string;  // Adicionado campo semestre
  class?: string;     // Adicionado campo turma
  type?: 'calculus' | 'math' | 'algorithms' | 'practices' | 'challenges';
  backgroundColor?: string;
  borderColor?: string;
}

interface EventEditPanelProps {
  selectedEvent: Event | null;
  onSave: (event: Event) => void;
  onDelete: (eventId: number) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const EventEditPanel: React.FC<EventEditPanelProps> = ({
  selectedEvent,
  onSave,
  onDelete,
  onCancel,
  isEditing
}) => {
  const [formData, setFormData] = useState<Event>({
    title: '',
    start: '',
    end: '',
    room: '',
    professor: '',
    semester: '',    // Adicionado ao estado inicial
    class: '',       // Adicionado ao estado inicial
    type: 'math'
  });

  // Event type colors
  const eventTypeColors = {
    calculus: { bg: '#d1fae5', border: '#10b981' },
    math: { bg: '#dbeafe', border: '#3b82f6' },
    algorithms: { bg: '#fef3c7', border: '#f59e0b' },
    practices: { bg: '#e9d5ff', border: '#8b5cf6' },
    challenges: { bg: '#fecaca', border: '#f87171' }
  };

  // Generate time options
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 7; hour <= 22; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Days of the week
  const dayOptions = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  useEffect(() => {
    if (selectedEvent) {
      const startDate = selectedEvent.start ? new Date(selectedEvent.start) : new Date();
      const endDate = selectedEvent.end ? new Date(selectedEvent.end) : new Date(startDate.getTime() + 60*60*1000);
      
      setFormData({
        id: selectedEvent.id,
        title: selectedEvent.title || '',
        start: formatDateTimeLocal(startDate),
        end: formatDateTimeLocal(endDate),
        room: selectedEvent.room || '',
        professor: selectedEvent.professor || '',
        semester: selectedEvent.semester || '',  // Recupera o semestre
        class: selectedEvent.class || '',        // Recupera a turma
        type: selectedEvent.type || 'math'
      });
    } else {
      // Reset form for new event
      const now = new Date();
      const nextHour = new Date(now.getTime() + 60*60*1000);
      
      setFormData({
        title: '',
        start: formatDateTimeLocal(now),
        end: formatDateTimeLocal(nextHour),
        room: '',
        professor: '',
        semester: '',    // Reseta o semestre
        class: '',       // Reseta a turma
        type: 'math'
      });
    }
  }, [selectedEvent]);

  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Por favor, insira um título para o evento.');
      return;
    }

    const startDate = new Date(formData.start);
    const endDate = new Date(formData.end);

    if (endDate <= startDate) {
      alert('O horário final deve ser posterior ao horário inicial.');
      return;
    }

    const colors = eventTypeColors[formData.type as keyof typeof eventTypeColors];
    
    const eventToSave: Event = {
      ...formData,
      id: formData.id || Date.now(),
      start: formData.start,
      end: formData.end,
      backgroundColor: colors.bg,
      borderColor: colors.border
    };

    onSave(eventToSave);
  };

  const handleDelete = () => {
    if (formData.id && window.confirm('Tem certeza que deseja excluir este evento?')) {
      onDelete(formData.id);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {isEditing ? 'Editar Evento' : 'Novo Evento'}
        </h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium mb-1">Título *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o título do evento"
          />
        </div>

        {/* Tipo do Evento */}
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="calculus">Cálculo</option>
            <option value="math">Matemática</option>
            <option value="algorithms">Algoritmos</option>
            <option value="practices">Práticas</option>
            <option value="challenges">Desafios</option>
          </select>
        </div>

        {/* Data e Hora Início */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Data e Hora Início *
          </label>
          <input
            type="datetime-local"
            value={formData.start}
            onChange={(e) => handleInputChange('start', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Data e Hora Fim */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Data e Hora Fim *
          </label>
          <input
            type="datetime-local"
            value={formData.end}
            onChange={(e) => handleInputChange('end', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sala */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Sala
          </label>
          <input
            type="text"
            value={formData.room}
            onChange={(e) => handleInputChange('room', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: A101, Lab02"
          />
        </div>

        {/* Professor */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-1">
            <User className="w-4 h-4" />
            Professor
          </label>
          <input
            type="text"
            value={formData.professor}
            onChange={(e) => handleInputChange('professor', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do professor"
          />
        </div>

        {/* Grid com Semestre e Turma */}
        <div className="grid grid-cols-2 gap-4">
          {/* Semestre */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Semestre
            </label>
            <input
              type="text"
              value={formData.semester}
              onChange={(e) => handleInputChange('semester', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 2024/1"
            />
          </div>

          {/* Turma */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <Users className="w-4 h-4" />
              Turma
            </label>
            <input
              type="text"
              value={formData.class}
              onChange={(e) => handleInputChange('class', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: A, B, C"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <Button 
            onClick={handleSave}
            className="flex-1 bg-pampa-green hover:bg-pampa-green/90 text-white"
          >
            {isEditing ? 'Salvar Alterações' : 'Adicionar Evento'}
          </Button>
          
          {isEditing && (
            <Button 
              onClick={handleDelete}
              variant="destructive"
              className="px-4"
            >
              Excluir
            </Button>
          )}
          
          <Button 
            onClick={onCancel}
            variant="outline"
            className="px-4"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventEditPanel;