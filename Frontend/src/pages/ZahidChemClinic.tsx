import React, { useState } from 'react';
import { 
  Beaker, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Award, 
  Users, 
  Calendar, 
  ArrowRight, 
  ChevronRight, 
  Copy, 
  Check, 
  ShieldCheck, 
  GraduationCap, 
  Clock, 
  Zap 
} from 'lucide-react';

export const ZahidChemClinic: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('01841783983');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-jakarta selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO SECTION */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 bg-white border-b border-slate-200/80 overflow-hidden">
        {/* Soft Background Radial Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-50/50 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs sm:text-sm font-bold tracking-wide shadow-sm">
                <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                <span>Offline Batch Enrolling • HSC '28 Batch</span>
              </div>

              {/* Big Headline */}
              <h1 className="font-outfit font-black text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.1]">
                Master HSC Chemistry 1st Paper with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900">Zahid Sir</span>
              </h1>

              {/* Value Proposition */}
              <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Build rock-solid conceptual clarity, master equation solving, and secure top grades in HSC Board Exams + Medical & Engineering Admissions at Chattogram’s premier chemistry clinic.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="tel:01841783983"
                  className="w-full sm:w-auto font-outfit px-7 py-4 text-base font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-lg shadow-slate-900/10 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 group"
                >
                  <Phone className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
                  <span>Call 01841783983</span>
                </a>

                <a
                  href="#contact-location"
                  className="w-full sm:w-auto font-outfit px-7 py-4 text-base font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  <span>Visit Gulzar Tower</span>
                </a>
              </div>

              {/* Quick Feature Chips */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Offline Physical Classes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Limited Seat Batches</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Gulzar Tower, Chawkbazar</span>
                </div>
              </div>

            </div>

            {/* Right Column: Premium Scholarship Offer Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none bg-white p-6 sm:p-8 rounded-3xl text-slate-900 shadow-xl shadow-slate-200/80 border border-slate-200/90 space-y-6">
                
                {/* Header Pill Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                    🎓 SSC'26 / HSC'28 Batch Special Offer
                  </span>
                </div>

                {/* Course Title & Highlighting Offer */}
                <div className="space-y-3">
                  <h3 className="font-outfit font-extrabold text-xl sm:text-2xl text-slate-900 leading-snug">
                    Zahid Sir's Chemistry 1st Paper Offline Course
                  </h3>

                  {/* Discount Highlight Banner */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 font-outfit font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-md">
                    <Sparkles className="w-5 h-5 text-slate-950 animate-bounce" />
                    <span>🔥 Get 25%+ Scholarship Discount</span>
                  </div>

                  <p className="text-slate-500 text-xs sm:text-sm font-medium">
                    For SSC'26 students preparing for HSC Chemistry.
                  </p>
                </div>

                {/* Benefits List */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs sm:text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Offline Class</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Concept Based Learning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Board Exam Focused Preparation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Experienced Guidance by Zahid Sir</span>
                  </div>
                </div>

                {/* Location & Contact Info */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span><strong>Location:</strong> Gulzar Tower (4th Floor), Chawkbazar, Chattogram</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Contact:</strong> 01841783983</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-scholarship-modal'))}
                  className="w-full font-outfit py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <Beaker className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span>Claim Scholarship</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </button>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. COURSE HIGHLIGHTS */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold tracking-wide">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Syllabus & Features
            </div>
            <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Why Join HSC'28 Chemistry 1st Paper?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Engineered from the ground up to ensure complete mastery over the National Curriculum chemistry syllabus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-outfit font-bold text-xl text-slate-900">
                Complete 1st Paper Syllabus
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                In-depth coverage of Atomic Structure, Periodic Properties, Chemical Bonding, Quantitative Chemistry, and Environmental Chemistry.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-outfit font-bold text-xl text-slate-900">
                Zero Memorization Concept
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Focus on fundamental chemical logic, electron configuration rules, and reaction dynamics rather than rote learning.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-outfit font-bold text-xl text-slate-900">
                HSC + Admission Target
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Integrated preparation designed to guarantee GPA 5.00 in Board Exams while building the base for BUET and Medical admissions.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-outfit font-bold text-xl text-slate-900">
                Weekly Class Tests & Analytics
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Chapter-wise evaluations, board-standard creative questions (CQ), and multiple-choice (MCQ) weekly examinations.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-outfit font-bold text-xl text-slate-900">
                Handcrafted Lecture Sheets
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Exclusive printed lecture notes, formula sheets, and past 10-year board question solutions curated by Zahid Sir.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-outfit font-bold text-xl text-slate-900">
                Personalized Care & Mentorship
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Small batch sizes to ensure every student receives individual guidance and immediate doubt resolution.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. OFFLINE CLASS INFORMATION */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
            
            {/* Soft Ambient Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-800/60 border border-indigo-700 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> Offline Classroom Experience
                </div>

                <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  State-of-the-Art Offline Facility at Chawkbazar
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Experience direct face-to-face interaction, high-energy lectures, and interactive whiteboard demonstrations designed to make complex chemistry topics effortless.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-outfit font-bold text-sm text-white">Climate Controlled</h4>
                      <p className="text-slate-400 text-xs">Modern AC classroom environment for focused learning.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-outfit font-bold text-sm text-white">Doubt-Solving Desk</h4>
                      <p className="text-slate-400 text-xs">Post-class one-on-one problem solving support.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-indigo-950/80 p-8 rounded-2xl border border-indigo-800/80 space-y-6">
                <h3 className="font-outfit font-extrabold text-xl text-white border-b border-indigo-800 pb-3">
                  Batch Details & Schedule
                </h3>

                <ul className="space-y-4 text-sm font-medium">
                  <li className="flex items-center justify-between">
                    <span className="text-indigo-300">Course Name</span>
                    <span className="text-white font-semibold">HSC '28 Chemistry 1st Paper</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-indigo-300">Class Mode</span>
                    <span className="text-white font-semibold">Offline Physical Classroom</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-indigo-300">Seat Capacity</span>
                    <span className="text-emerald-400 font-semibold">Limited per batch</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-indigo-300">Location</span>
                    <span className="text-white font-semibold">Gulzar Tower (4th Floor)</span>
                  </li>
                </ul>

                <a
                  href="tel:01841783983"
                  className="w-full font-outfit py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-xl shadow transition text-center flex items-center justify-center gap-2 text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 01841783983 to Book</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. TEACHER SECTION */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xl shadow-slate-200/50 space-y-8">
            
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              
              {/* Teacher Avatar Box */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-indigo-600 to-indigo-900 p-1.5 shadow-lg shrink-0">
                <div className="w-full h-full rounded-[22px] bg-slate-900 flex flex-col items-center justify-center text-white p-4 text-center">
                  <Beaker className="w-10 h-10 text-indigo-400 mb-1" />
                  <span className="font-outfit font-black text-lg">Zahid Sir</span>
                  <span className="text-[10px] text-indigo-300 uppercase tracking-wider font-semibold">Chemistry Lead</span>
                </div>
              </div>

              {/* Teacher Profile Info */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <Award className="w-3.5 h-3.5" /> 10+ Years Teaching Excellence
                </div>

                <h2 className="font-outfit font-black text-3xl sm:text-4xl text-slate-900">
                  Meet Zahid Sir
                </h2>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                  Widely celebrated among Chattogram’s student community for transforming complex organic and quantitative chemistry into intuitive, crystal-clear concepts.
                </p>
              </div>

            </div>

            <div className="bg-indigo-50/70 p-6 rounded-2xl border border-indigo-100 text-indigo-950 font-medium text-sm sm:text-base italic leading-relaxed">
              "Chemistry is not about memorizing equations—it is about understanding the fundamental physical laws that govern matter. Once you grasp the core logic, scoring top marks becomes second nature."
              <span className="block not-italic font-bold text-slate-900 mt-2 text-xs uppercase tracking-wider">— Zahid Sir</span>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. LOCATION / CONTACT SECTION */}
      {/* ------------------------------------------------------------------ */}
      <section id="contact-location" className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold tracking-wide">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Classroom Location & Contact
            </div>
            <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Visit Zahid's Chem Clinic
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Conveniently located at the education hub of Chattogram.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Location Card */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="font-outfit font-bold text-2xl text-slate-900">
                  Classroom Address
                </h3>
                <p className="text-slate-700 font-semibold text-lg">
                  Gulzar Tower (4th Floor)
                </p>
                <p className="text-slate-600 text-sm">
                  Chawkbazar, Chattogram, Bangladesh
                </p>
              </div>

              <div className="pt-2 text-xs font-medium text-slate-500 flex items-center gap-1">
                <ChevronRight className="w-4 h-4 text-indigo-600" />
                <span>Located directly in the Chawkbazar coaching center hub</span>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="font-outfit font-bold text-2xl text-slate-900">
                  Admission Hotline
                </h3>
                <p className="text-emerald-700 font-mono font-extrabold text-2xl tracking-wide">
                  01841783983
                </p>
                <p className="text-slate-600 text-sm">
                  Call directly to inquire about batch timings, fees, and offline admission seats.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href="tel:01841783983"
                  className="flex-1 font-outfit py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call Now</span>
                </a>

                <button
                  onClick={handleCopyPhone}
                  className="px-4 py-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-sm transition flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. FINAL ENROLLMENT CTA */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          
          <div className="w-16 h-16 rounded-3xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400">
            <Beaker className="w-8 h-8" />
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            <h2 className="font-outfit font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Start Your HSC '28 Chemistry Journey Today
            </h2>
            <p className="text-slate-300 text-base sm:text-lg font-medium">
              Join Zahid Sir's offline batch at Gulzar Tower, Chawkbazar. Secure your seat before batch capacity fills up.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="tel:01841783983"
              className="w-full sm:w-auto font-outfit px-8 py-4 text-base font-extrabold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2.5"
            >
              <Phone className="w-5 h-5 text-slate-950" />
              <span>Call 01841783983</span>
            </a>

            <a
              href="#contact-location"
              className="w-full sm:w-auto font-outfit px-8 py-4 text-base font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-2xl transition flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5 text-indigo-400" />
              <span>Gulzar Tower (4th Floor)</span>
            </a>
          </div>

          <p className="text-xs text-slate-400 font-medium">
            Chawkbazar, Chattogram • Zahid's Chem Clinic
          </p>

        </div>
      </section>

    </div>
  );
};

export default ZahidChemClinic;
