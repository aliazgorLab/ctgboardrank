import React, { useState } from 'react';
import { Search, Loader2, Sparkles, ArrowRight, Beaker, Hash, BadgeCheck, AlertCircle } from 'lucide-react';

interface RankFormProps {
  onSubmit: (roll: string, reg: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const RankForm: React.FC<RankFormProps> = ({ onSubmit, isLoading, error }) => {
  const [roll, setRoll] = useState('');
  const [reg, setReg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roll.trim() || !reg.trim()) return;
    onSubmit(roll.trim(), reg.trim());
  };

  return (
    <section id="rank-checker" className="py-16 lg:py-24 bg-slate-50 font-jakarta relative overflow-hidden">
      
      {/* Background Subtle Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Form Card Container */}
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xl shadow-slate-200/60 relative">
          
          {/* Top Decorative Sparkle Badge */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> SSC '26 Official Database
            </span>
          </div>

          {/* Section Heading */}
          <div className="text-center space-y-2 mb-8">
            <h2 className="font-outfit font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Check Your Merit Standing
            </h2>
            <p className="font-jakarta text-sm sm:text-base text-slate-500 font-medium">
              Enter your SSC credentials below.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input 1: Roll Number */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Hash className="w-5 h-5" />
              </div>
              <input
                type="text"
                id="rollNumber"
                required
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                placeholder=" "
                className="peer w-full pl-11 pr-4 pt-5 pb-2 text-sm font-semibold text-slate-900 bg-slate-50/60 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all duration-200"
              />
              <label
                htmlFor="rollNumber"
                className="absolute text-xs font-semibold text-slate-500 duration-200 transform -translate-y-2.5 scale-90 top-4 z-10 origin-[0] left-11 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-2.5 peer-focus:text-indigo-600 pointer-events-none"
              >
                SSC Roll Number (e.g. 102938)
              </label>
            </div>

            {/* Input 2: Registration Number */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <input
                type="text"
                id="regNumber"
                required
                value={reg}
                onChange={(e) => setReg(e.target.value)}
                placeholder=" "
                className="peer w-full pl-11 pr-4 pt-5 pb-2 text-sm font-semibold text-slate-900 bg-slate-50/60 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all duration-200"
              />
              <label
                htmlFor="regNumber"
                className="absolute text-xs font-semibold text-slate-500 duration-200 transform -translate-y-2.5 scale-90 top-4 z-10 origin-[0] left-11 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-2.5 peer-focus:text-indigo-600 pointer-events-none"
              >
                Registration Number (e.g. 2110482910)
              </label>
            </div>

            {/* Subtle Error Message Display (e.g. 404 Not Found) */}
            {error && (
              <div className="p-4 rounded-2xl bg-red-50/90 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !roll.trim() || !reg.trim()}
              className="font-outfit font-bold w-full py-4 text-base text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                  <span>Analyzing Chittagong Board Database...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 text-indigo-400" />
                  <span>Calculate Exact Rank</span>
                </>
              )}
            </button>

            {/* Promotional Banner Card */}
            <div
              onClick={() => window.dispatchEvent(new CustomEvent('open-scholarship-modal'))}
              className="p-4 sm:p-5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/90 transition-all duration-200 group cursor-pointer space-y-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 shadow-sm mt-0.5">
                    <Beaker className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-outfit font-extrabold text-sm sm:text-base text-emerald-950 flex items-center gap-1.5">
                      🎓 SSC'26 Students Special Offer
                    </h4>
                    <p className="text-xs sm:text-sm font-medium text-emerald-800 leading-snug">
                      Claim your HSC'28 Chemistry Scholarship and get 25%+ discount from Zahid Sir.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-emerald-200/70">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                  Limited Seat Offline Batch
                </span>
                <div className="font-outfit font-extrabold text-xs sm:text-sm text-white bg-emerald-700 group-hover:bg-emerald-800 px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5">
                  <span>Claim Discount Offer</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-200 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
};
