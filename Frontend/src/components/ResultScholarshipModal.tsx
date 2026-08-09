import React, { useState, useEffect } from 'react';
import { X, Sparkles, Beaker, ArrowRight, Gift } from 'lucide-react';

interface ResultScholarshipModalProps {
  isResultLoaded: boolean;
}

export const ResultScholarshipModal: React.FC<ResultScholarshipModalProps> = ({ isResultLoaded }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isResultLoaded) return;

    // Check if scholarship popup has already been shown in current session
    const seen = sessionStorage.getItem('scholarship_popup_seen');
    if (!seen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('scholarship_popup_seen', 'true');
      }, 5000); // Wait 5 seconds after successful rank search

      return () => clearTimeout(timer);
    }
  }, [isResultLoaded]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('scholarship_popup_seen', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 font-jakarta">
      
      {/* Modal Container */}
      <div 
        className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl border border-indigo-700/80 p-6 sm:p-8 md:p-10 max-w-lg w-full shadow-2xl space-y-6 text-center overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Soft Background Ambient Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/10 blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-indigo-600/20 blur-3xl pointer-events-none -z-0" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Celebration Icon */}
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
          <Sparkles className="w-8 h-8 text-slate-950 animate-bounce" />
        </div>

        {/* Text Content */}
        <div className="relative z-10 space-y-3">
          
          {/* Discount Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold tracking-wide">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            ২৫%+ Scholarship Discount
          </div>

          {/* Headline */}
          <h3 className="font-outfit font-black text-2xl sm:text-3xl text-white tracking-tight leading-snug">
            🎉 SSC'26 শিক্ষার্থীদের জন্য বিশেষ Scholarship Offer
          </h3>

          {/* Body */}
          <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed max-w-md mx-auto">
            Zahid Sir এর HSC'28 Chemistry 1st Paper Offline Course এ পাচ্ছেন ২৫%+ ছাড়
          </p>

        </div>

        {/* Modal Action Buttons */}
        <div className="relative z-10 space-y-3 pt-2">
          <button
            onClick={() => {
              handleClose();
              window.dispatchEvent(new CustomEvent('open-scholarship-modal'));
            }}
            className="w-full font-outfit py-4 px-6 text-base font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-2xl shadow-xl shadow-amber-400/20 hover:shadow-amber-400/30 transition-all duration-200 flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <Beaker className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span>Claim Scholarship</span>
            <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors py-1"
          >
            Not now, close window
          </button>
        </div>

      </div>

    </div>
  );
};
