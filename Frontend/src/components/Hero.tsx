import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Beaker, 
  ShieldCheck, 
  Cpu, 
  Award, 
  CheckCircle2, 
  FileText,
  User
} from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-slate-50 font-jakarta">
      
      {/* Subtle Background Glow Spheres */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/40 via-indigo-100/30 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-5 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-5 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Subheading & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-sm text-slate-700 text-xs sm:text-sm font-semibold">
              <span className="text-indigo-600 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> ✨ SSC'26 Merit Rank Estimator
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">
                Powered by Zahid's Chem Clinic
              </span>
            </div>

            {/* Oversized High-Impact Headline (Outfit Font) */}
            <h1 className="font-outfit font-black text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.12]">
              Find Your Exact{' '}
              <span className="font-outfit font-black italic text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">
                Chittagong Board Rank
              </span>{' '}
              in Seconds.
            </h1>

            {/* Subheading (Plus Jakarta Sans) */}
            <p className="font-jakarta text-base sm:text-lg text-slate-600 font-medium max-w-2xl leading-relaxed">
              Analyze your GPA, total marks, and board standing instantly. Brought to you by Zahid Sir's HSC Chemistry Care to kickstart your college journey.
            </p>

            {/* Side-by-Side CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto pt-2">
              {/* Primary Button */}
              <Link
                to="/check-result"
                className="font-outfit font-bold w-full sm:w-auto px-8 py-4 text-base text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md hover:shadow-slate-900/20 transition-all duration-200 flex items-center justify-center gap-2.5 group"
              >
                Check My Rank Now
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Secondary Button */}
              <a
                href="#hsc-batches"
                className="font-outfit font-semibold w-full sm:w-auto px-8 py-4 text-base text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Beaker className="w-4 h-4 text-indigo-600" />
                Explore HSC '28 Batches
              </a>
            </div>

            {/* Trust Bar Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full pt-4 text-left">
              
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-outfit text-xs font-bold text-slate-900">100% Focused</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Chittagong Board Standard</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 shrink-0">
                  <Cpu className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-outfit text-xs font-bold text-slate-900">Dynamic Algorithm</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Marks & Tie-Breaker Logic</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 shrink-0">
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-outfit text-xs font-bold text-slate-900">Top HSC Care</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Zahid's Chem Clinic CTG</p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Visual Preview Mockup Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              
              {/* Soft Ambient Shadow Blur */}
              <div className="absolute -inset-2 rounded-3xl bg-slate-200/70 blur-xl -z-10" />

              {/* White Theme Mockup Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xl shadow-slate-200/60 space-y-5">
                
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-outfit text-sm font-bold text-slate-900">Merit Result Pass</h3>
                      <p className="text-xs text-slate-500">Board: Chittagong Education Board</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
                  </span>
                </div>

                {/* Board Standing Banner */}
                <div className="bg-slate-900 p-5 rounded-2xl text-center text-white space-y-1.5 relative overflow-hidden shadow-sm">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Estimated Board Standing
                  </span>
                  
                  <div className="py-1">
                    <span className="font-outfit font-extrabold inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-sm tracking-wide">
                      🏆 #14 in Chittagong Board
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Calculated amongst 140,000+ examinees
                  </p>
                </div>

                {/* Student Info Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" /> Student Name:
                    </span>
                    <span className="font-outfit font-bold text-slate-900 text-sm">Abrar Hossain</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Roll & Board:</span>
                    <span className="font-semibold text-slate-800">102938 • Chittagong</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <span className="text-slate-500 text-[11px] block">GPA Score</span>
                      <span className="font-outfit text-base font-extrabold text-slate-900">5.00</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <span className="text-slate-500 text-[11px] block">Total Marks</span>
                      <span className="font-outfit text-base font-extrabold text-blue-600">1142</span>
                    </div>
                  </div>
                </div>

                {/* Footer Snippet inside Card */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2.5 text-xs text-slate-600">
                  <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                    <Beaker className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800">
                    Enrolled in Zahid's Chem Clinic HSC Batch A
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
