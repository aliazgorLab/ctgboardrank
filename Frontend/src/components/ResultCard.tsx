import React from 'react';
import { CheckCircle2, Sparkles, Beaker, ArrowRight, User, Hash, Award, BarChart3, RefreshCw } from 'lucide-react';

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
              {data.name}
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

      {/* The "Next Step" CTA (Zahid's Chem Clinic) */}
      <div className="bg-indigo-50/90 border border-indigo-100 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0 shadow-sm mt-0.5">
            <Beaker className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-outfit font-bold text-sm text-indigo-950">
              Next Mission: HSC Science
            </h4>
            <p className="text-xs text-indigo-800 font-medium leading-relaxed">
              Claim your <strong className="text-indigo-950 font-bold">20% early-bird discount</strong> for Zahid's Chem Clinic Batch '28.
            </p>
          </div>
        </div>

        <a
          href="#zahid-chem-clinic"
          className="font-outfit font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap flex items-center gap-2 group w-full sm:w-auto justify-center"
        >
          Claim Discount & Enroll
          <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

    </div>
  );
};
