
import React from 'react';
import { Button } from "@/components/ui/button";
import Logo from './Logo';
import { Clock } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-full h-16 px-6 flex items-center justify-between border-b">
      <div className="flex items-center space-x-8">
        <Logo />

        <div className="hidden sm:flex space-x-6">
          <a href="/" className="font-medium">Home</a>
          <a href="#" className="text-gray-500">Relatórios</a>
          <a href="#" className="text-gray-500">Configuração</a>
          <a href="#" className="text-gray-500">Contato</a>
        </div>
      </div>

      <div className="flex items-center space-x-4">
      <div className="flex justify-between">
            <Button className="bg-pampa-green hover:bg-pampa-green/90 text-white">
              Publicar
            </Button>
          </div>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500">
          <Clock className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
            alt="Perfil"
            className="w-full h-full object-cover"
          />

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
