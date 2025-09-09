
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-4 mt-8 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} ID Verify Pro. All rights reserved.</p>
        <p className="mt-1">
          This application is for demonstration purposes only. Do not use with real sensitive documents.
        </p>
      </div>
    </footer>
  );
};
