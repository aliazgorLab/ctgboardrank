import React from 'react';
import { ArrowRight, Beaker, Gift, GraduationCap } from 'lucide-react';

interface ScholarshipOfferCardProps {
  className?: string;
}

export const ScholarshipOfferCard: React.FC<ScholarshipOfferCardProps> = ({ className = '' }) => {
  return (
    <div className={`relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl border border-indigo-800/60 p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden ${className}`}>
      
      {/* Background Soft Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/15 blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/10 blur-2xl pointer-events-none -z-0" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        
        {/* Left Side Info */}
        <div className="space-y-4 text-center md:text-left max-w-2xl">
          
          {/* Top Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              ২৫%+ Scholarship Discount
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              Zahid Sir's Chem Clinic
            </span>
          </div>

          {/* Main Bangla Headline */}
          <h3 className="font-outfit font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-snug">
            SSC'26 / HSC'28 ব্যাচের জন্য বিশেষ Chemistry Scholarship Offer
          </h3>

          {/* Subheadline */}
          <p className="font-jakarta text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
            SSC Result এর পর HSC Chemistry প্রস্তুতি শুরু করুন Zahid Sir এর সাথে
          </p>

        </div>

        {/* Right Side Discount & Action */}
        <div className="flex flex-col items-center shrink-0 space-y-4 w-full sm:w-auto">
          
          {/* Discount Badge Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 px-6 py-3 rounded-2xl text-center space-y-0.5 shadow-inner w-full sm:w-auto">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
              Exclusive Offer
            </span>
            <span className="font-outfit font-black text-3xl sm:text-4xl text-white tracking-tight block">
              ২৫%+ Off
            </span>
            <span className="text-[11px] text-slate-300 font-medium block">
              HSC '28 Chemistry 1st Paper
            </span>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-scholarship-modal'))}
            className="w-full sm:w-auto font-outfit px-8 py-3.5 text-sm sm:text-base font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-2xl shadow-lg shadow-amber-400/20 hover:shadow-amber-400/30 transition-all duration-200 flex items-center justify-center gap-2.5 group cursor-pointer"
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
