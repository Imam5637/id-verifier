
import React, { useRef, useState, useCallback } from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const UploadCloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);


export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { t } = useLocalization();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);


  return (
    <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-gray-200">
        <h2 className="text-2xl font-semibold text-brand-dark mb-2">{t('upload.title')}</h2>
        <p className="text-gray-600 mb-6">{t('upload.subtitle')}</p>
        <div
            className={`relative border-2 border-dashed rounded-lg p-10 cursor-pointer transition-colors duration-300 ${isDragOver ? 'border-brand-blue bg-brand-light-blue/20' : 'border-gray-300 hover:border-brand-blue'}`}
            onClick={handleClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
            />
            <div className="flex flex-col items-center">
                <UploadCloudIcon/>
                <p className="mt-4 text-lg font-medium text-gray-700" dangerouslySetInnerHTML={{ __html: t('upload.cta') }} />
                <p className="mt-1 text-sm text-gray-500">{t('upload.supported_files')}</p>
            </div>
        </div>
        <div className="mt-6 text-xs text-gray-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {t('upload.secure_notice')}
        </div>
    </div>
  );
};
