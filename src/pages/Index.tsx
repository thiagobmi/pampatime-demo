
import React from 'react';
import Navbar from '@/components/Navbar';
import SidePanel from '@/components/SidePanel';
import Timetable from '@/components/Timetable';
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-6">
        {/* <div className="mb-4 flex justify-between">
          <Button className="bg-pampa-green hover:bg-pampa-green/90 text-white">
            Publicar
          </Button>
        </div> */}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="lg:col-span-1">
            <SidePanel />
          </div>
          
          <div className="lg:col-span-3">
            <Timetable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
