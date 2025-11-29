import React from "react";
import { useLanguage } from "./LanguageContext";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  const handleKeyDown = (e: React.KeyboardEvent, language: 'en' | 'th') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setLang(language);
    }
  };

  return (
    <div className="ml-4 flex items-center space-x-4" role="radiogroup" aria-label="Language selection">
      {/* English Option */}
      <div
        role="radio"
        aria-checked={lang === 'en'}
        tabIndex={0}
        onClick={() => setLang('en')}
        onKeyDown={(e) => handleKeyDown(e, 'en')}
        className="flex items-center cursor-pointer group p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Change language to English"
      >
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
          lang === 'en' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400 group-hover:border-indigo-500'
        }`}>
          {lang === 'en' && <div className="w-2 h-2 rounded-full bg-white"></div>}
        </div>
        <span className={`ml-2 text-sm font-medium transition-colors duration-200 ${
          lang === 'en' ? 'text-indigo-700 font-semibold' : 'text-gray-600 group-hover:text-indigo-600'
        }`}>
          EN
        </span>
      </div>

      {/* Thai Option */}
      <div
        role="radio"
        aria-checked={lang === 'th'}
        tabIndex={0}
        onClick={() => setLang('th')}
        onKeyDown={(e) => handleKeyDown(e, 'th')}
        className="flex items-center cursor-pointer group p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Change language to Thai"
      >
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
          lang === 'th' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400 group-hover:border-indigo-500'
        }`}>
          {lang === 'th' && <div className="w-2 h-2 rounded-full bg-white"></div>}
        </div>
        <span className={`ml-2 text-sm font-medium transition-colors duration-200 ${
          lang === 'th' ? 'text-indigo-700 font-semibold' : 'text-gray-600 group-hover:text-indigo-600'
        }`}>
          ไทย
        </span>
      </div>
    </div>
  );
};

export default LanguageToggle;