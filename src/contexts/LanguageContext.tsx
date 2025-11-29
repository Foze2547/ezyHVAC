
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the shape of the context value
interface LanguageContextType {
  lang: 'en' | 'th';
  toggleLang: () => void; // Kept for potential other uses
  setLang: Dispatch<SetStateAction<'en' | 'th'>>; // Expose the setter from useState
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [lang, setLang] = useState<'en' | 'th'>('en'); 

  const toggleLang = () => {
    setLang((prevLang) => (prevLang === 'en' ? 'th' : 'en'));
  };

  const value: LanguageContextType = {
    lang,
    toggleLang,
    setLang,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};