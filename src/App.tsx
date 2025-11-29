import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/Footer"; 
import { LanguageProvider } from "./contexts/LanguageContext"; 
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SeerCalculator from "./components/SeerCalculator";
import Pipecal from './pages/Pipecal';import Compare from "./components/Compare";
import Header from "./components/Header"; 
import Upload from "./components/Upload"; 
import Document from "./components/Document";
import Comparepage from "./pages/Comparepage"; 
import Uploadpage from "./pages/Uploadpage"; 
import Documentpage from "./pages/Documentpage";
import VisitorCounter from './components/VisitorCounter';
import Coolingloadpage from './pages/Coolingloadpage';
import ImageCalculatorPage from './pages/ImageCalculatorPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <BrowserRouter> 
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/ImageCalculator" replace />} />
            <Route path="/Coolingload" element={<Index />} />
            <Route path="/compare" element={<Comparepage/>} />
            <Route path="/Upload" element={<Uploadpage />} />
            <Route path="/Pipecal" element={<Pipecal/>} />
            <Route path="/document" element={<Documentpage />} />
            <Route path="/SeerCal" element={<Coolingloadpage />} />
            <Route path="/ImageCalculator" element={<ImageCalculatorPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer/>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;