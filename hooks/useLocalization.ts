import React, { createContext, useState, useContext, useCallback } from 'react';
import en from '../locales/en.json';
import bn from '../locales/bn.json';

type Language = 'en' | 'bn';

const translations = { en, bn };

interface LocalizationContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
        let translation = translations[language][key as keyof typeof translations[Language]] || key;
        
        if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
                translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
            });
        }
        
        return translation;
    }, [language]);

    // FIX: The component was missing a return value and used JSX in a `.ts` file.
    // Replaced JSX with `React.createElement` to fix parsing errors and return a valid React element.
    return React.createElement(LocalizationContext.Provider, { value: { language, setLanguage, t } }, children);
};

export const useLocalization = (): LocalizationContextType => {
    const context = useContext(LocalizationContext);
    if (!context) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};