import React from 'react';
import type { VerificationData } from '../types';
import { VerificationStatus } from '../types';
import { useLocalization } from '../hooks/useLocalization';

interface VerificationResultProps {
  result: VerificationData;
  imageSrc: string;
  onReset: () => void;
}

const DataRow: React.FC<{ label: string; value: string | null }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-200">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="text-sm text-gray-900 font-mono">{value || 'N/A'}</dd>
    </div>
);

const ConfidenceBar: React.FC<{ score: number }> = ({ score }) => {
    const { t } = useLocalization();
    const width = `${Math.round(score * 100)}%`;
    const color = score > 0.8 ? 'bg-status-green' : score > 0.5 ? 'bg-status-yellow' : 'bg-status-red';
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{t('result.confidence')}</span>
                <span className="text-sm font-medium text-gray-700">{width}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: width }}></div>
            </div>
        </div>
    );
};

export const VerificationResult: React.FC<VerificationResultProps> = ({ result, imageSrc, onReset }) => {
    const { t } = useLocalization();
    
    const statusConfig = React.useMemo(() => ({
      [VerificationStatus.VERIFIED]: {
        text: t('result.status.VERIFIED'),
        bgColor: 'bg-status-green/10',
        textColor: 'text-status-green',
        borderColor: 'border-status-green/50',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      [VerificationStatus.REJECTED]: {
        text: t('result.status.REJECTED'),
        bgColor: 'bg-status-red/10',
        textColor: 'text-status-red',
        borderColor: 'border-status-red/50',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      [VerificationStatus.UNSURE]: {
        text: t('result.status.UNSURE'),
        bgColor: 'bg-status-yellow/10',
        textColor: 'text-status-yellow',
        borderColor: 'border-status-yellow/50',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
      },
    }), [t]);


    const currentStatus = statusConfig[result.status] || statusConfig[VerificationStatus.UNSURE];

    const handleExport = () => {
        const dataString = JSON.stringify(result, null, 2);
        const blob = new Blob([dataString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `verification-result-${result.extractedData.idNumber || Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
            <div className="p-6">
                <h2 className="text-2xl font-semibold text-brand-dark mb-4">{t('result.title')}</h2>
                <div className={`flex items-center p-4 rounded-lg border ${currentStatus.bgColor} ${currentStatus.borderColor}`}>
                    <div className={currentStatus.textColor}>{currentStatus.icon}</div>
                    <div className="ml-3">
                        <p className={`text-lg font-semibold ${currentStatus.textColor}`}>{currentStatus.text}</p>
                        <p className="text-sm text-gray-600">{result.reasoning}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6 bg-gray-50/50">
                <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">{t('result.uploaded_document')}</h3>
                    <img src={imageSrc} alt="Uploaded ID" className="rounded-lg shadow-md border border-gray-200 w-full" />
                </div>

                <div className="md:col-span-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">{t('result.extracted_information')}</h3>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <dl>
                            <DataRow label={t('result.data.document_type')} value={result.documentType} />
                            <DataRow label={t('result.data.full_name')} value={result.extractedData.fullName} />
                            <DataRow label={t('result.data.id_number')} value={result.extractedData.idNumber} />
                            <DataRow label={t('result.data.dob')} value={result.extractedData.dateOfBirth} />
                            <DataRow label={t('result.data.expiry')} value={result.extractedData.expiryDate} />
                        </dl>
                    </div>

                    {result.extractedData.rawText && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">{t('result.raw_ocr_text')}</h3>
                            <pre className="bg-gray-100 rounded-lg p-4 text-xs text-gray-700 font-mono whitespace-pre-wrap border border-gray-200 max-h-40 overflow-y-auto">
                                {result.extractedData.rawText}
                            </pre>
                        </div>
                    )}

                    <div className="mt-6">
                       <ConfidenceBar score={result.confidenceScore} />
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gray-50 flex justify-end items-center space-x-4">
                 <button
                    onClick={handleExport}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                    {t('result.export_button')}
                </button>
                <button
                    onClick={onReset}
                    className="bg-brand-blue hover:bg-brand-dark text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                >
                    {t('result.verify_another_button')}
                </button>
            </div>
        </div>
    );
};