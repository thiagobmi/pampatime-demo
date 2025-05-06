
import React from 'react';
import { Button } from "@/components/ui/button";
import FilterDropdown from './FilterDropdown';
import ClassCard from './ClassCard';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

const SidePanel = () => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col h-full">
      {/* Search bar on the right side */}
      <div className="relative mb-4">
        <Input 
          type="text" 
          placeholder="Pesquisar" 
          className="pl-8 pr-4 py-2 w-full border rounded-lg text-sm"
        />
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>
      
      {/* Centralized fields */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-center">
          <FilterDropdown label="Professor" className="w-64" />
        </div>
        <div className="flex justify-center">
          <FilterDropdown label="Semestre" className="w-64" />
        </div>
        <div className="flex justify-center">
          <FilterDropdown label="Sala" className="w-64" />
        </div>
        <div className="flex justify-center">
          <FilterDropdown label="Curso" className="w-64" />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Button variant="outline" size="sm" className="text-xs bg-white font-medium">Adicionar</Button>
        <Button variant="outline" size="sm" className="text-xs bg-white font-medium">Editar</Button>
        <Button variant="outline" size="sm" className="text-xs bg-white font-medium">Excluir</Button>
      </div>
      
      <div className="mt-2 flex-grow">
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-450px)]">
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
          
          <ClassCard 
            title="Estatística" 
            room="D104" 
            professor="Prof. Pereira"
            type="math"
          />
        </div>
        
        <div className="mt-4 text-center text-gray-500 text-sm border-t pt-4">
          <p>Placeholder para calendário</p>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
