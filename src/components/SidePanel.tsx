
import React from 'react';
import { Button } from "@/components/ui/button";
import FilterDropdown from './FilterDropdown';
import ClassCard from './ClassCard';
import { Search } from 'lucide-react';

const SidePanel = () => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg flex flex-col h-full">
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
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Button variant="secondary" className="text-xs">Adicionar</Button>
        <Button variant="secondary" className="text-xs">Editar</Button>
        <Button variant="secondary" className="text-xs">Excluir</Button>
      </div>
      
      <div className="mt-2 flex-grow">
        <div className="relative mb-4">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Pesquisar" 
            className="pl-8 pr-4 py-2 w-full border rounded-md text-sm"
          />
          <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
            <svg width="16" height="16" viewBox="0 0 15 15" fill="none">
              <path d="M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM4 7.5C4 7.22386 4.22386 7 4.5 7H10.5C10.7761 7 11 7.22386 11 7.5C11 7.77614 10.7761 8 10.5 8H4.5C4.22386 8 4 7.77614 4 7.5ZM5 10.5C5 10.2239 5.22386 10 5.5 10H9.5C9.77614 10 10 10.2239 10 10.5C10 10.7761 9.77614 11 9.5 11H5.5C5.22386 11 5 10.7761 5 10.5Z" fill="currentColor"></path>
            </svg>
          </Button>
        </div>
        
        <div className="space-y-2">
          <ClassCard 
            title="Cálculo I" 
            room="A101" 
            professor="Prof. Silva"
            type="calculus"
          />
          
          <ClassCard 
            title="Matemática Discreta" 
            room="B205" 
            professor="Prof. Oliveira"
            type="math"
          />
          
          <ClassCard 
            title="Algoritmos e Programação" 
            room="C310" 
            professor="Prof. Santos"
            type="algorithms"
          />
        </div>
        
        <div className="mt-4 text-center text-gray-500 text-sm">
          <p>Placeholder para calendário</p>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
