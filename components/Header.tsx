
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.917a12.02 12.02 0 009 2.083a12.02 12.02 0 009-2.083c0-4.017-1.48-7.728-4.382-10.478z" />
    </svg>
);

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage, t } = useLocalization();
    
    return (
        <div className="relative">
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'bn')}
                className="bg-brand-dark text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-light-blue appearance-none pr-8"
                aria-label="Language selector"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                }}
            >
                <option value="en">{t('language.english')}</option>
                <option value="bn">{t('language.bengali')}</option>
            </select>
        </div>
    );
};


export const Header: React.FC = () => {
    const { t } = useLocalization();
    return (
        <header className="bg-brand-dark shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-3">
                        <ShieldCheckIcon />
                        <h1 className="text-2xl font-bold text-white tracking-wide">
                            {t('header.title')}
                        </h1>
                    </div>
                    <LanguageSwitcher />
                </div>
            </div>
        </header>
    );
};
