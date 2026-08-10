import React, { useState } from 'react';
import { DeveloperModal } from './DeveloperModal';

export const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-white border-t border-slate-100 py-6 sm:py-8 font-jakarta text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-medium text-slate-500">
          
          {/* Main Copyright & Brand Powering */}
          <p className="text-slate-400">
            © 2026 Chittagong Board Rank Checker. Proudly powered by Zahid's Chem Clinic.
          </p>

          {/* Minimal Developer Credit Link */}
          <p className="text-slate-400 text-xs sm:text-sm">
            Developed by{' '}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="font-bold text-slate-700 hover:text-indigo-600 underline underline-offset-4 decoration-indigo-300 hover:decoration-indigo-600 transition-all cursor-pointer"
            >
              Md. Ali Azgor
            </button>
          </p>

        </div>
      </footer>

      {/* Developer Profile Modal */}
      <DeveloperModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
