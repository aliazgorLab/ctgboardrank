import React from 'react';
import { CheckCircle2, Sparkles, User, Hash, Award, BarChart3, RefreshCw } from 'lucide-react';

export interface ResultData {
  name: string;
  roll: string;
  reg: string;
  gpa: number | string;
  achievement?: string;
  marks: string | number;
  rank: number | string;
  totalStudents?: string | number;
}

interface ResultCardProps {
  data: ResultData;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data, onReset }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xl shadow-emerald-500/10 space-y-8 animate-in fade-in zoom-in-95 duration-500 font-jakarta">
      
      {/* Top Header Badge & Reset Button */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Official Board Standard</span>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Check Another Rank
        </button>
      </div>

      {/* The Grand Reveal (Centerpiece) */}
      <div className="text-center space-y-3 py-2 bg-gradient-to-b from-slate-50/80 to-white rounded-2xl p-6 border border-slate-100">
        <p className="font-jakarta text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Your Estimated Board Merit Position
        </p>

        {/* Big Rank Number */}
        <div className="flex items-center justify-center gap-1">
          <span className="font-outfit font-black text-5xl sm:text-6xl lg:text-7xl text-emerald-600 tracking-tight">
            #{data.rank}
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/60 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Top Merit Tier in Chittagong Board
        </div>

        <p className="font-jakarta text-xs sm:text-sm text-slate-500 font-medium pt-1">
          Out of {data.totalStudents || '142,000+'} examinees in Chittagong Board
        </p>
      </div>

      {/* Student Data Grid (2x2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        
        {/* Examinee Name */}
        <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shrink-0">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              Examinee Name
            </span>
            <span className="font-outfit font-bold text-sm sm:text-base text-slate-900">
              {data.name || 'Examinee'}
            </span>
          </div>
        </div>

        {/* Roll & Reg */}
        <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shrink-0">
            <Hash className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              Roll & Reg
            </span>
            <span className="font-mono font-bold text-sm text-slate-800">
              {data.roll} / {data.reg.length > 8 ? `${data.reg.substring(0, 7)}...` : data.reg}
            </span>
          </div>
        </div>

        {/* GPA Result */}
        <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shrink-0">
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              GPA Result
            </span>
            <span className="font-outfit font-bold text-sm sm:text-base text-emerald-700">
              {typeof data.gpa === 'number' ? data.gpa.toFixed(2) : data.gpa} {data.achievement ? `(${data.achievement})` : ''}
            </span>
          </div>
        </div>

        {/* Total Marks */}
        <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shrink-0">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              Total Marks
            </span>
            <span className="font-outfit font-bold text-sm sm:text-base text-slate-900">
              {data.marks} / 1300
            </span>
          </div>
        </div>

      </div>

      {/* Result Special Offer CTA (Zahid's Chem Clinic) */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-amber-500/40 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-xl relative overflow-hidden text-white">
        
        {/* Soft Background Accent Lighting */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 blur-2xl pointer-events-none -z-0" />

        <div className="relative z-10 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shrink-0 shadow-md mt-0.5">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-outfit font-black text-sm sm:text-base text-white tracking-wide">
                🎓 SSC'26 Result Special Offer
              </h4>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold">
                25%+ Scholarship
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              অভিনন্দন! আপনার SSC'26 ফলাফলের ভিত্তিতে Zahid Sir's HSC'28 Chemistry Batch-এ পাচ্ছেন <strong className="text-amber-400 font-extrabold">25%+ Scholarship Discount</strong>.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('open-scholarship-modal'))}
          className="relative z-10 font-outfit font-extrabold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 px-6 py-3.5 rounded-xl shadow-lg shadow-amber-400/20 hover:shadow-amber-400/30 transition-all duration-200 whitespace-nowrap flex items-center gap-2 group w-full sm:w-auto justify-center cursor-pointer shrink-0"
        >
          <span>Claim 25%+ Scholarship →</span>
        </button>
      </div>

    </div>
  );
};
