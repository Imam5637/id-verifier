
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

export const LoadingSpinner: React.FC = () => {
    const { t } = useLocalization();
    const [messageIndex, setMessageIndex] = React.useState(0);
    
    const messages = React.useMemo(() => [
        t('loading.messages.0'),
        t('loading.messages.1'),
        t('loading.messages.2'),
        t('loading.messages.3'),
        t('loading.messages.4'),
        t('loading.messages.5'),
    ], [t]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
        }, 2000);

        return () => clearInterval(intervalId);
    }, [messages.length]);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-blue"></div>
            <h2 className="mt-6 text-xl font-semibold text-brand-dark">{t('loading.title')}</h2>
            <p className="mt-2 text-gray-600 transition-opacity duration-500">
                {messages[messageIndex]}
            </p>
        </div>
    );
};
