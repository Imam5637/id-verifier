
import React from 'react';

const messages = [
  "Initializing verification protocol...",
  "Analyzing document structure...",
  "Scanning for security features...",
  "Cross-referencing data points...",
  "Checking for digital anomalies...",
  "Finalizing AI analysis..."
];

export const LoadingSpinner: React.FC = () => {
    const [messageIndex, setMessageIndex] = React.useState(0);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-blue"></div>
            <h2 className="mt-6 text-xl font-semibold text-brand-dark">Verifying Document</h2>
            <p className="mt-2 text-gray-600 transition-opacity duration-500">
                {messages[messageIndex]}
            </p>
        </div>
    );
};
