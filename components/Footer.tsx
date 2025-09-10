
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

export const Footer: React.FC = () => {
  const { t } = useLocalization();
  return (
    <footer className="bg-white py-4 mt-8 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        <p className="mt-1">
          {t('footer.disclaimer')}
        </p>
      </div>
    </footer>
  );
};
