import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  isSpanish: boolean;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [isSpanish, setIsSpanish] = useState(false);

  const toggleLanguage = () => {
    setIsSpanish(prev => !prev);
  };

  return (
    <LanguageContext.Provider value={{ isSpanish, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
} 