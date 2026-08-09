import React from 'react';
import { FlaskConical, Target, Sparkles, ArrowRight, ShieldCheck, Beaker } from 'lucide-react';

export const PromoSection: React.FC = () => {
  return (
    <section id="zahid-chem-clinic" className="py-20 lg:py-28 bg-gradient-to-b from-white to-slate-50 font-jakarta relative overflow-hidden">
      
      {/* Background Glow Accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-100/30 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wide">
            <Beaker className="w-3.5 h-3.5 text-indigo-600" /> Chittagong's Premier HSC Coaching
          </div>
          <h2 className="font-outfit font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
            Why Top Chittagong Board Students Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600">
              Zahid's Chem Clinic
            </span>
          </h2>
          <p className="font-jakarta text-base text-slate-600 font-medium max-w-2xl mx-auto">
            Build bulletproof conceptual clarity in HSC Chemistry with structured lectures, board-standard practice, and personalized care.
          </p>
        </div>

        {/* 3-Column Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: Zero to Pro Chemistry */}
          <div className="bg-white border border-slate-200/90 p-8 rounded-3xl shadow-md hover:shadow-xl hover:border-indigo-200 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="font-outfit font-bold text-xl text-slate-900">
              Zero to Pro Chemistry
            </h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Master HSC Chemistry from the basics to university admission levels with visual animations and problem-solving shortcuts.
            </p>
          </div>

          {/* Card 2: Board Standard Exams */}
          <div className="bg-white border border-slate-200/90 p-8 rounded-3xl shadow-md hover:shadow-xl hover:border-blue-200 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-outfit font-bold text-xl text-slate-900">
              Board Standard Exams
            </h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Weekly model tests perfectly aligned with the Chittagong Board curriculum, ensuring 100% preparation for CQ & MCQ sections.
            </p>
          </div>

          {/* Card 3: Smart Mentorship */}
          <div className="bg-white border border-slate-200/90 p-8 rounded-3xl shadow-md hover:shadow-xl hover:border-emerald-200 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-outfit font-bold text-xl text-slate-900">
              Smart Mentorship
            </h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              24/7 doubt-solving sessions, individual progress analytics, and a personalized roadmap guaranteed for GPA 5.00 success.
            </p>
          </div>

        </div>

        {/* The 'Early Bird' Offer Banner */}
        <div id="hsc-batches" className="relative rounded-3xl bg-indigo-900 p-8 sm:p-12 text-white shadow-2xl overflow-hidden">
          
          {/* Subtle Ambient Background Gradients inside banner */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            
            {/* Left Content */}
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/80 border border-indigo-700 text-cyan-300 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" /> Early Bird Admissions Open
              </div>
              <h3 className="font-outfit font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-snug">
                Enroll in HSC '28 Batch A Today. Secure your seat before results are published!
              </h3>
              <p className="text-xs sm:text-sm text-indigo-200 font-medium">
                Limited seats available for Chittagong offline & online batches. Get 20% instant early-bird fee waiver.
              </p>
            </div>

            {/* Right Button */}
            <div className="shrink-0 w-full md:w-auto">
              <a
                href="#enroll"
                className="font-outfit font-bold text-sm sm:text-base text-indigo-950 bg-white hover:bg-slate-100 px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 group w-full md:w-auto cursor-pointer"
              >
                Join Batch '28 Now
                <ArrowRight className="w-4 h-4 text-indigo-900 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
