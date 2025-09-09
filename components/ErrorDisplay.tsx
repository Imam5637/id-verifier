
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-status-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-red-200">
        <div className="flex justify-center mb-4">
            <ErrorIcon />
        </div>
        <h2 className="text-2xl font-semibold text-status-red mb-2">An Error Occurred</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
            onClick={onRetry}
            className="bg-brand-blue hover:bg-brand-dark text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
        >
            Try Again
        </button>
    </div>
  );
};
