import React from 'react';
import Navbar from '@/components/Navbar';
import SidePanel from '@/components/SidePanel';
import Timetable from '@/components/Timetable';

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Navbar />
      
      <main className="flex-1 p-2 md:p-4 min-h-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-4 h-full">
          <div className="lg:col-span-1 h-full overflow-auto">
            <SidePanel />
          </div>
          
          <div className="lg:col-span-3 h-full">
            <Timetable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;