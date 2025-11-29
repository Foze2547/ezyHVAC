import React from 'react';
import Header from '@/components/Header';
import SeerCalculator from '@/components/SeerCalculator';
import Footer from '@/components/Footer';
import Document from '@/components/Document';

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
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4  ">
      <Document />
        
      </main>
      
    </div>
  );
};

export default Index;
