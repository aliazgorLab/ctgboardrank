import React, { useState, useEffect } from 'react';
import { X, Beaker, ArrowRight, Gift } from 'lucide-react';

export const ScholarshipPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if popup has already been shown in this browser session
    const seen = sessionStorage.getItem('scholarship_popup_seen');
    if (!seen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('scholarship_popup_seen', 'true');
      }, 7000); // 7-second delay on initial site visit

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('scholarship_popup_seen', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-[calc(100vw-2.5rem)] animate-in fade-in slide-in-from-bottom-5 duration-300 font-jakarta">
      <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 border border-indigo-700/60 shadow-2xl overflow-hidden space-y-4">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Offer Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            ২৫%+ Scholarship Discount
          </span>
        </div>

        {/* Content Body */}
        <div className="space-y-2 pr-6">
          <h4 className="font-outfit font-extrabold text-lg text-white leading-snug">
            SSC'26 / HSC'28 ব্যাচের জন্য বিশেষ Chemistry Scholarship Offer
          </h4>
          <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
            SSC Result এর পর HSC Chemistry প্রস্তুতি শুরু করুন Zahid Sir এর সাথে
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-1 flex items-center gap-3">
          <button
            onClick={() => {
              handleClose();
              window.dispatchEvent(new CustomEvent('open-scholarship-modal'));
            }}
            className="w-full font-outfit py-3 px-5 text-xs sm:text-sm font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Beaker className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span>Claim Scholarship</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};
