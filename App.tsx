
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { VerificationResult } from './components/VerificationResult';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Footer } from './components/Footer';
import { verifyIdDocument } from './services/geminiService';
import type { VerificationData } from './types';

export default function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('gemini-api-key') || '');
  const [tempApiKey, setTempApiKey] = useState<string>('');
  const [showApiInput, setShowApiInput] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && (event.key === 'K' || event.key === 'k')) {
        event.preventDefault();
        setShowApiInput(prev => !prev);
        setTempApiKey(apiKey); // Pre-fill with current key when opening
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [apiKey]);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini-api-key', apiKey);
    } else {
      localStorage.removeItem('gemini-api-key');
    }
  }, [apiKey]);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!apiKey) {
        setError('Please configure your API Key. Press Ctrl+Shift+K to open the configuration panel.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setVerificationResult(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      setUploadedImage(`data:${file.type};base64,${base64String}`);

      try {
        const result = await verifyIdDocument(apiKey, base64String, file.type);
        setVerificationResult(result);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to verify the document. The AI model may be unavailable or the document could not be processed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
        setError("Failed to read the file.");
        setIsLoading(false);
    }
    reader.readAsDataURL(file);
  }, [apiKey]);

  const handleReset = () => {
    setUploadedImage(null);
    setVerificationResult(null);
    setError(null);
    setIsLoading(false);
  };
  
  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    setShowApiInput(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorDisplay message={error} onRetry={handleReset} />;
    }
    if (verificationResult && uploadedImage) {
      return <VerificationResult result={verificationResult} imageSrc={uploadedImage} onReset={handleReset} />;
    }
    return <FileUpload onFileSelect={handleFileSelect} />;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl">
           {showApiInput && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mb-6 shadow-md" role="alert">
                <h3 className="font-bold">API Key Configuration</h3>
                <p className="text-sm">Press <kbd className="font-sans px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Ctrl</kbd> + <kbd className="font-sans px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Shift</kbd> + <kbd className="font-sans px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">K</kbd> to toggle this panel.</p>
                <div className="flex items-center mt-3 space-x-2">
                  <input
                    type="password"
                    placeholder="Enter your Gemini API Key"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    className="flex-grow p-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-900"
                    aria-label="Gemini API Key"
                  />
                  <button
                    onClick={handleSaveApiKey}
                    className="bg-brand-blue hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
}
