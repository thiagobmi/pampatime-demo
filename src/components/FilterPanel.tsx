// src/components/FilterPanel.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import SearchableFilter from './SearchableFilter';
import { Event, createEventWithFixedDate } from '@/types/Event';
import {
  getDisciplinaByNome,
  getDisciplinaById,
  getSalaByCodigo,
  getTurmaByCodigo,
  getTipoByNome,
  getSemestreByCodigo,
  getHorarioByHora,
  getDiaByNome,
  getProfessorByNome,
  getAcademicData
} from '@/utils/academicDataUtils';

interface FilterPanelProps {
  selectedEvent?: Event | null;
  onEventUpdate?: (event: Event) => void;
  onEventAdd?: (event: Event) => void;
  onEventDelete?: (eventId: string | number) => void;
  onClearSelection?: () => void;
  onEventChange?: (event: Event) => void;
}

// Internal form state interface with IDs
interface FormState {
  disciplina: string; // Nome da disciplina
  disciplinaCodigo: string; // Código da disciplina
  disciplinaId: string; // ID único da disciplina
  professor: string;
  professorId: string;
  semestre: string;
  semestreId: string;
  horarioInicio: string;
  horarioInicioId: string;
  horarioFinal: string;
  horarioFinalId: string;
  sala: string;
  salaId: string;
  dia: string;
  diaId: string;
  turma: string;
  turmaId: string;
  modalidade: string; // Teórica, Prática ou Assíncrona
  modalidadeId: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedEvent,
  onEventUpdate,
  onEventAdd,
  onEventDelete,
  onClearSelection,
  onEventChange
}) => {
  // State to track form values
  const [formData, setFormData] = useState<FormState>({
    disciplina: '',
    disciplinaCodigo: '',
    disciplinaId: '',
    professor: '',
    professorId: '',
    semestre: '',
    semestreId: '',
    horarioInicio: '',
    horarioInicioId: '',
    horarioFinal: '',
    horarioFinalId: '',
    sala: '',
    salaId: '',
    dia: '',
    diaId: '',
    turma: '',
    turmaId: '',
    modalidade: '',
    modalidadeId: ''
  });

  // Update form when selectedEvent changes OR when event is dragged
  // Update form when selectedEvent changes OR when event is dragged
// Update form when selectedEvent changes OR when event is dragged
// Update form when selectedEvent changes OR when event is dragged
  useEffect(() => {
    console.log('FilterPanel: selectedEvent changed', selectedEvent);
    
    if (selectedEvent) {
      const startTime = selectedEvent.start ? new Date(selectedEvent.start) : null;
      const endTime = selectedEvent.end ? new Date(selectedEvent.end) : null;

      // Tentar encontrar a disciplina pelo título (nome)
      const disciplinaEncontrada = getDisciplinaByNome(selectedEvent.title);

      const newFormData = {
        disciplina: selectedEvent.title || '',
        disciplinaCodigo: disciplinaEncontrada?.codigo || '',
        disciplinaId: disciplinaEncontrada?.id || '',
        professor: selectedEvent.professor || '',
        professorId: '',
        semestre: selectedEvent.semester || '',
        semestreId: '',
        horarioInicio: startTime ? formatTimeForInput(startTime) : '',
        horarioInicioId: '',
        horarioFinal: endTime ? formatTimeForInput(endTime) : '',
        horarioFinalId: '',
        sala: selectedEvent.room || '',
        salaId: '',
        dia: startTime ? getDayNameFromFixedDate(startTime) : '',
        diaId: '',
        turma: selectedEvent.class || '',
        turmaId: '',
        modalidade: selectedEvent.type || '',
        modalidadeId: ''
      };

      console.log('FilterPanel: Setting new form data', newFormData);
      setFormData(newFormData);
    } else {
      // Clear form when no event is selected
      console.log('FilterPanel: Clearing form data');
      setFormData({
        disciplina: '',
        disciplinaCodigo: '',
        disciplinaId: '',
        professor: '',
        professorId: '',
        semestre: '',
        semestreId: '',
        horarioInicio: '',
        horarioInicioId: '',
        horarioFinal: '',
        horarioFinalId: '',
        sala: '',
        salaId: '',
        dia: '',
        diaId: '',
        turma: '',
        turmaId: '',
        modalidade: '',
        modalidadeId: ''
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

    // Generate all possible half-hour times
    const allTimes: string[] = [];
    for (let hour = 7; hour <= 22; hour++) {
      allTimes.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    // Filter times that are STRICTLY greater than start time (not equal)
    return allTimes.filter(time => timeToMinutes(time) > startMinutes);
  };

  // Função para sincronizar disciplina e código
  const syncDisciplinaFields = (disciplinaId: string, isCodeSelection: boolean = false) => {
    const academicData = getAcademicData();
    const disciplina = academicData.disciplinas.find(d => d.id === disciplinaId);

    if (disciplina) {
      setFormData(prev => ({
        ...prev,
        disciplina: disciplina.nome,
        disciplinaCodigo: disciplina.codigo,
        disciplinaId: disciplina.id
      }));
    }
  };

  const handleFieldChange = (field: keyof FormState, value: string, id?: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };

      // Store the ID if provided
      if (id) {
        const idField = `${field}Id` as keyof FormState;
        newData[idField] = id;
      }

      // If start time changed, clear end time if it's now invalid
      if (field === 'horarioInicio' && prev.horarioFinal) {
        const startMinutes = timeToMinutes(value);
        const endMinutes = timeToMinutes(prev.horarioFinal);
        // End time must be STRICTLY greater than start time (not equal)
        if (endMinutes <= startMinutes) {
          newData.horarioFinal = '';
          newData.horarioFinalId = '';
        }
      }

      return newData;
    });

    // Se foi uma seleção de disciplina, sincronizar os campos
    if ((field === 'disciplina' || field === 'disciplinaCodigo') && id) {
      syncDisciplinaFields(id, field === 'disciplinaCodigo');
    }
  };

  // Handler especial para disciplina que sincroniza código
  const handleDisciplinaChange = (value: string, id?: string) => {
    if (id) {
      syncDisciplinaFields(id, false);
    } else {
      // Se não tem ID, é uma entrada manual
      setFormData(prev => ({
        ...prev,
        disciplina: value,
        disciplinaCodigo: '', // Limpar código se digitado manualmente
        disciplinaId: ''
      }));
    }
  };

  // Handler especial para código que sincroniza disciplina
  const handleCodigoChange = (value: string, id?: string) => {
    if (id) {
      syncDisciplinaFields(id, true);
    } else {
      // Se não tem ID, é uma entrada manual
      setFormData(prev => ({
        ...prev,
        disciplinaCodigo: value,
        disciplina: '', // Limpar nome se digitado manualmente
        disciplinaId: ''
      }));
    }
  };

  // Função para verificar se todos os campos obrigatórios estão preenchidos
  const todosOsCamposPreenchidos = (): boolean => {
    const camposObrigatorios = [
      'disciplina', 'professor', 'semestre', 'horarioInicio',
      'horarioFinal', 'sala', 'dia', 'turma', 'modalidade'
    ];

    return camposObrigatorios.every(campo => {
      const valor = formData[campo as keyof FormState];
      return valor && valor.trim() !== '';
    });
  };

  // Função para verificar se horários são válidos
  const horariosValidos = (): boolean => {
    if (!formData.horarioInicio || !formData.horarioFinal) return false;

    const startMinutes = timeToMinutes(formData.horarioInicio);
    const endMinutes = timeToMinutes(formData.horarioFinal);

    return endMinutes > startMinutes;
  };

  const podeExecutarAcao = (): boolean => {
    return todosOsCamposPreenchidos() && horariosValidos();
  };

  const handleAdd = () => {
    if (selectedEvent) {
      return alert('Por favor, cancele a edição atual antes de adicionar um novo evento.');
    }

    // Validar TODOS os campos obrigatórios
    const camposObrigatorios = [
      { campo: 'disciplina', nome: 'Disciplina' },
      { campo: 'professor', nome: 'Professor' },
      { campo: 'semestre', nome: 'Semestre' },
      { campo: 'horarioInicio', nome: 'Horário Início' },
      { campo: 'horarioFinal', nome: 'Horário Final' },
      { campo: 'sala', nome: 'Sala' },
      { campo: 'dia', nome: 'Dia' },
      { campo: 'turma', nome: 'Turma' },
      { campo: 'modalidade', nome: 'Modalidade' }
    ];

    const camposFaltando = camposObrigatorios.filter(
      ({ campo }) => !formData[campo as keyof FormState] || formData[campo as keyof FormState].trim() === ''
    );

    if (camposFaltando.length > 0) {
      const nomesCampos = camposFaltando.map(({ nome }) => nome).join(', ');
      alert(`Por favor, preencha todos os campos obrigatórios: ${nomesCampos}`);
      return;
    }

    // Validar que horário final é posterior ao inicial
    const startMinutes = timeToMinutes(formData.horarioInicio);
    const endMinutes = timeToMinutes(formData.horarioFinal);

    if (endMinutes <= startMinutes) {
      alert('O horário final deve ser posterior ao horário inicial.');
      return;
    }

    // Use a disciplina como título do evento
    const newEvent = createEventWithFixedDate(
      formData.disciplina, // Disciplina como título
      formData.dia,
      formData.horarioInicio,
      formData.horarioFinal,
      {
        room: formData.sala,
        professor: formData.professor,
        semester: formData.semestre,
        class: formData.turma,
        type: formData.modalidade, // Modalidade (Teórica/Prática/Assíncrona)
        id: `event-${Date.now()}`
      }
    );

    if (onEventAdd) {
      onEventAdd(newEvent);
    }

    // Clear form after adding
    setFormData({
      disciplina: '',
      disciplinaCodigo: '',
      disciplinaId: '',
      professor: '',
      professorId: '',
      semestre: '',
      semestreId: '',
      horarioInicio: '',
      horarioInicioId: '',
      horarioFinal: '',
      horarioFinalId: '',
      sala: '',
      salaId: '',
      dia: '',
      diaId: '',
      turma: '',
      turmaId: '',
      modalidade: '',
      modalidadeId: ''
    });
  };

  const handleEdit = () => {
    if (!selectedEvent || !formData.disciplina) {
      alert('Selecione um evento e preencha os campos necessários');
      return;
    }

    // Validar TODOS os campos obrigatórios
    const camposObrigatorios = [
      { campo: 'disciplina', nome: 'Disciplina' },
      { campo: 'professor', nome: 'Professor' },
      { campo: 'semestre', nome: 'Semestre' },
      { campo: 'horarioInicio', nome: 'Horário Início' },
      { campo: 'horarioFinal', nome: 'Horário Final' },
      { campo: 'sala', nome: 'Sala' },
      { campo: 'dia', nome: 'Dia' },
      { campo: 'turma', nome: 'Turma' },
      { campo: 'modalidade', nome: 'Modalidade' }
    ];

    const camposFaltando = camposObrigatorios.filter(
      ({ campo }) => !formData[campo as keyof FormState] || formData[campo as keyof FormState].trim() === ''
    );

    if (camposFaltando.length > 0) {
      const nomesCampos = camposFaltando.map(({ nome }) => nome).join(', ');
      alert(`Por favor, preencha todos os campos obrigatórios: ${nomesCampos}`);
      return;
    }

    // Validar que horário final é posterior ao inicial
    const startMinutes = timeToMinutes(formData.horarioInicio);
    const endMinutes = timeToMinutes(formData.horarioFinal);

    if (endMinutes <= startMinutes) {
      alert('O horário final deve ser posterior ao horário inicial.');
      return;
    }

    // Create updated event using the unified function with all fields
    const updatedEvent = createEventWithFixedDate(
      formData.disciplina, // Disciplina como título
      formData.dia,
      formData.horarioInicio,
      formData.horarioFinal,
      {
        room: formData.sala,
        professor: formData.professor,
        semester: formData.semestre,
        class: formData.turma,
        type: formData.modalidade, // Modalidade (Teórica/Prática/Assíncrona)
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
      {/* Aviso sobre campos obrigatórios */}

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
        {/* Disciplina e Código - campos sincronizados */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Disciplina
            </label>
            <SearchableFilter
              label="Disciplina"
              value={formData.disciplina}
              onSelect={handleDisciplinaChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Código Disciplina
            </label>
            <SearchableFilter
              label="Código Disciplina"
              value={formData.disciplinaCodigo}
              onSelect={handleCodigoChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Professor
            </label>
            <SearchableFilter
              label="Professor"
              value={formData.professor}
              onSelect={(value, id) => handleFieldChange('professor', value, id)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Semestre
            </label>
            <SearchableFilter
              label="Semestre"
              value={formData.semestre}
              onSelect={(value, id) => handleFieldChange('semestre', value, id)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Horário Início
            </label>
            <SearchableFilter
              label="Horário Início"
              value={formData.horarioInicio}
              onSelect={(value, id) => handleFieldChange('horarioInicio', value, id)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Horário Final
            </label>
            <SearchableFilter
              label="Horário Final"
              value={formData.horarioFinal}
              options={getAvailableEndTimes()}
              onSelect={(value, id) => handleFieldChange('horarioFinal', value, id)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Sala
            </label>
            <SearchableFilter
              label="Sala"
              value={formData.sala}
              onSelect={(value, id) => handleFieldChange('sala', value, id)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Dia
            </label>
            <SearchableFilter
              label="Dia"
              value={formData.dia}
              onSelect={(value, id) => handleFieldChange('dia', value, id)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Turma
            </label>
            <SearchableFilter
              label="Turma"
              value={formData.turma}
              onSelect={(value, id) => handleFieldChange('turma', value, id)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Modalidade
            </label>
            <SearchableFilter
              label="Modalidade"
              value={formData.modalidade}
              onSelect={(value, id) => handleFieldChange('modalidade', value, id)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`text-xs font-medium ${podeExecutarAcao()
              ? 'bg-white hover:bg-green-50 text-gray-900'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          onClick={handleAdd}
          disabled={!podeExecutarAcao()}
          title={!podeExecutarAcao() ? 'Preencha todos os campos obrigatórios' : 'Adicionar evento'}
        >
          Adicionar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`text-xs font-medium ${selectedEvent && podeExecutarAcao()
              ? 'bg-white hover:bg-blue-50 text-gray-900'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          onClick={handleEdit}
          disabled={!selectedEvent || !podeExecutarAcao()}
          title={
            !selectedEvent
              ? 'Selecione um evento para editar'
              : !podeExecutarAcao()
                ? 'Preencha todos os campos obrigatórios'
                : 'Editar evento'
          }
        >
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`text-xs font-medium ${selectedEvent
              ? 'bg-white hover:bg-red-50 text-gray-900'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          onClick={handleDelete}
          disabled={!selectedEvent}
          title={!selectedEvent ? 'Selecione um evento para excluir' : 'Excluir evento'}
        >
          Excluir
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;