import React from 'react';
import Header from '@/components/Header';
import SeerCalculator from '@/components/SeerCalculator';
import Footer from '@/components/Footer';
import Compare from '@/components/Compare';
import Coolingload from '@/components/Coolingload';

const Index = () => {
  return (
    <div
      className="min-h-screen text-gray-100 flex flex-col bg-center" 
      style={{
        backgroundImage: "linear-gradient(rgba(0.2, 0.2, 0.2, 0.2), rgba(0, 0, 0, 0.3)), url('/89CC71B6-8882-478E-8537-AF4A4D9BE730.jpg')",
        backgroundSize: "cover", 
        backgroundAttachment: "fixed" 
      }}
    >
      <main className="max-w-6xl px-4 sm:px-4 lg:px-6 flex flex-col min-w-full  mx-auto mb-2">
        <Coolingload/>
      </main>
      
    </div>
  );
};

export default Index;
