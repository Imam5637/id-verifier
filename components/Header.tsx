
import React from 'react';

const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.917a12.02 12.02 0 009 2.083a12.02 12.02 0 009-2.083c0-4.017-1.48-7.728-4.382-10.478z" />
    </svg>
);


export const Header: React.FC = () => {
    return (
        <header className="bg-brand-dark shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-3">
                        <ShieldCheckIcon />
                        <h1 className="text-2xl font-bold text-white tracking-wide">
                            ID Verify Pro
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
};
