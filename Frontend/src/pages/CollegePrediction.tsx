import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Search,
  Loader2,
  AlertCircle,
  School,
  CheckCircle2,
  Award,
  Building2,
  ShieldAlert,
  TrendingUp,
  Info,
  BarChart3,
  Target,
  MessageCircle,
  BookOpen,
} from 'lucide-react';
import { StudentDetailsModal } from '../components/StudentDetailsModal';

export interface PredictionData {
  name: string;
  roll: string;
  group: string;
  gender?: string;
  totalMarks?: number;
  marks?: number;
  rank?: number;
  predictedCollege?: string;
  cutoff?: number;
  lastCutoff?: number;
  chance?: string;
  predictionAvailable?: boolean;
  message?: string;
}

export interface CollegeCutoff {
  name: string;
  cutoff: number;
  lastCutoff: number;
  seats: number;
  gender: string[];
  genderEligibility: string;
  medal: string;
}

export const GOVT_COLLEGES: CollegeCutoff[] = [
  {
    name: 'Chittagong College',
    cutoff: 1170,
    lastCutoff: 1170,
    seats: 660,
    gender: ['Male', 'Female'],
    genderEligibility: 'Male & Female',
    medal: '🥇',
  },
  {
    name: 'Govt. Hazi Muhammad Mohsin College, Chattogram',
    cutoff: 1150,
    lastCutoff: 1150,
    seats: 650,
    gender: ['Male', 'Female'],
    genderEligibility: 'Male & Female',
    medal: '🥈',
  },
  {
    name: 'Government City College',
    cutoff: 1131,
    lastCutoff: 1131,
    seats: 700,
    gender: ['Male', 'Female'],
    genderEligibility: 'Male & Female',
    medal: '🥉',
  },
  {
    name: "Chittagong Government Women's College",
    cutoff: 1114,
    lastCutoff: 1114,
    seats: 600,
    gender: ['Female'],
    genderEligibility: 'Female Only',
    medal: '🏫',
  },
  {
    name: 'Bakalia Government College',
    cutoff: 1107,
    lastCutoff: 1107,
    seats: 450,
    gender: ['Male', 'Female'],
    genderEligibility: 'Male & Female',
    medal: '🏫',
  },
  {
    name: 'Chattogram Govt. Model School & College',
    cutoff: 1100,
    lastCutoff: 1100,
    seats: 450,
    gender: ['Male', 'Female'],
    genderEligibility: 'Male & Female',
    medal: '🏫',
  },
  {
    name: 'Chittagong Collegiate College',
    cutoff: 1090,
    lastCutoff: 1090,
    seats: 200,
    gender: ['Male'],
    genderEligibility: 'Male Only',
    medal: '🏫',
  },
  {
    name: 'Govt. Ashekane Awlia Degree College',
    cutoff: 1050,
    lastCutoff: 1050,
    seats: 100,
    gender: ['Male', 'Female'],
    genderEligibility: 'Male & Female',
    medal: '🏫',
  },
];

export const COLLEGE_CUTOFFS_DATA = GOVT_COLLEGES;

export const calculateCollegeChance = (
  studentMarks: number,
  cutoff: number,
  studentGender?: string,
  collegeGender?: string[] | string
) => {
  if (studentGender === 'Female') {
    if (Array.isArray(collegeGender) && !collegeGender.includes('Female')) return 'Not Eligible';
    if (typeof collegeGender === 'string' && collegeGender === 'Male Only') return 'Not Eligible';
  }
  if (studentGender === 'Male') {
    if (Array.isArray(collegeGender) && !collegeGender.includes('Male')) return 'Not Eligible';
    if (typeof collegeGender === 'string' && collegeGender === 'Female Only') return 'Not Eligible';
  }

  const difference = studentMarks - cutoff;
  if (difference >= 30) return 'Very High';
  if (difference >= 10) return 'High';
  if (difference >= 0) return 'Good Chance';
  if (difference >= -10) return 'Competitive';
  return 'Low Chance';
};

export const CollegePrediction: React.FC = () => {
  const [inputRoll, setInputRoll] = useState<string>('');
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalRoll, setModalRoll] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchPrediction = async (rollToFetch: string) => {
    const trimmedRoll = rollToFetch.trim();
    if (!trimmedRoll) return;

    setIsLoading(true);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/college-prediction/${encodeURIComponent(trimmedRoll)}`);

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(`Roll number '${trimmedRoll}' was not found in Chittagong Board SSC 2026 records.`);
        }
        throw new Error('Unable to connect to college prediction service. Please try again.');
      }

      const data: PredictionData = await res.json();
      setPrediction(data);
      setInputRoll(data.roll || trimmedRoll);
    } catch (err: any) {
      console.error('Prediction fetch error:', err);
      setError(err.message || 'Failed to fetch admission prediction.');
      setPrediction(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const rollParam = params.get('roll');
    if (rollParam && rollParam.trim() !== '') {
      setInputRoll(rollParam.trim());
      fetchPrediction(rollParam.trim());
    }
  }, [location.search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRoll.trim()) {
      setError('Please enter a valid SSC roll number.');
      return;
    }
    navigate(`/college-prediction?roll=${encodeURIComponent(inputRoll.trim())}`);
  };

  const getChanceBadge = (chance: string) => {
    switch (chance.toLowerCase()) {
      case 'very high':
        return (
          <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Very High
          </span>
        );
      case 'high':
        return (
          <span className="px-3.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 shadow-xs">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            High
          </span>
        );
      case 'good chance':
        return (
          <span className="px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            Good Chance
          </span>
        );
      case 'competitive':
      case 'moderate':
        return (
          <span className="px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 shadow-xs">
            <Info className="w-4 h-4 text-amber-600" />
            Competitive
          </span>
        );
      case 'low chance':
      case 'low':
        return (
          <span className="px-3.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs">
            <Info className="w-4 h-4 text-rose-500" />
            Low Chance
          </span>
        );
      case 'not eligible':
        return (
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-400 border border-slate-200 text-xs font-semibold">
            Not Eligible
          </span>
        );
      default:
        return (
          <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs sm:text-sm font-bold">
            {chance}
          </span>
        );
    }
  };

  const getCollegeIcon = (collegeName: string) => {
    if (collegeName.includes('Chittagong College')) return '🥇';
    if (collegeName.includes('Mohsin')) return '🥈';
    if (collegeName.includes('City')) return '🥉';
    return '🏫';
  };

  return (
    <div className="min-h-[calc(100vh-140px)] py-10 sm:py-14 lg:py-16 bg-slate-50 text-slate-900 font-jakarta relative overflow-hidden flex flex-col justify-between">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-indigo-100/30 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full z-10">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs sm:text-sm font-bold tracking-wide">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            Chittagong Board Merit Predictor
          </div>
          
          <h1 className="font-outfit font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
            SSC '26 Govt. College <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 bg-clip-text text-transparent">Admission Predictor</span>
          </h1>

          <p className="font-jakarta text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto">
            Estimate your possible government college admission chance based on Chittagong Board total marks and previous cutoff trends.
          </p>
        </div>

        {/* Bangla Disclaimer Card */}
        <div className="max-w-4xl mx-auto bg-amber-50/90 border border-amber-200/80 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5 text-xs sm:text-sm text-slate-800 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-outfit font-extrabold text-amber-900 block">⚠️ সতর্কবার্তা:</span>
            <p className="text-amber-800 font-medium leading-relaxed font-jakarta">
              এটি একটি আন-অফিশিয়াল কলেজ ভর্তি সম্ভাবনা বিশ্লেষণ ব্যবস্থা।<br />
              পূর্ববর্তী ভর্তি তথ্য, সম্ভাব্য কাট-অফ মার্কস এবং শিক্ষার্থীর ফলাফলের ভিত্তিতে এই পূর্বাভাস তৈরি করা হয়েছে।<br />
              চূড়ান্ত ভর্তি সম্পূর্ণভাবে সরকারি ভর্তি নীতিমালা ও অফিসিয়াল মেধা তালিকার ওপর নির্ভর করবে।
            </p>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-white border border-slate-200 focus-within:border-indigo-500 rounded-2xl shadow-xl transition-all">
              <div className="relative w-full flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={inputRoll}
                  onChange={(e) => setInputRoll(e.target.value)}
                  placeholder="Enter SSC 2026 Roll Number (e.g. 112257)"
                  className="w-full pl-12 pr-4 py-3.5 bg-transparent text-slate-900 placeholder-slate-400 font-mono text-base font-bold focus:outline-none"
                  maxLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-outfit text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/20 shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Predicting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Predict College</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Alert */}
          {error && (
            <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs sm:text-sm font-medium flex items-center gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Non-Science Student Info Card */}
        {prediction && (prediction.predictionAvailable === false || prediction.group !== 'Science') && (
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white border border-blue-200/90 rounded-3xl p-6 sm:p-10 shadow-xl shadow-blue-500/10 space-y-6 animate-in fade-in zoom-in-95 duration-300 font-jakarta">
            
            {/* Header Tag */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block">
                    📚 Science Group Only
                  </span>
                  <h3 className="font-outfit font-extrabold text-xl sm:text-2xl text-slate-900">
                    {prediction.name || 'STUDENT RESULT'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-white border border-blue-200 text-xs font-mono font-bold text-slate-700">
                  Roll: #{prediction.roll}
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-100 border border-amber-300 text-xs font-extrabold text-amber-800">
                  Your Group: {prediction.group}
                </span>
              </div>
            </div>

            {/* Info Message Body */}
            <div className="bg-white border border-blue-100 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl sm:text-3xl shrink-0">📚</span>
                <div className="space-y-3">
                  <div className="space-y-1 text-slate-800">
                    <h4 className="font-outfit font-bold text-base sm:text-lg text-slate-900 leading-snug">
                      কলেজ প্রেডিকশন শুধুমাত্র বিজ্ঞান বিভাগের শিক্ষার্থীদের জন্য।
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      আপনি <strong className="text-indigo-600">{prediction.group}</strong> বিভাগের শিক্ষার্থী। আপনার জন্য এই মুহূর্তে বিজ্ঞান বিভাগের সরকারি কলেজ ভর্তি প্রেডিকশন প্রযোজ্য নয়।
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1">
                      ভর্তি সংক্রান্ত তথ্যের জন্য সরকারি ভর্তি বিজ্ঞপ্তি অনুসরণ করুন।
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 space-y-1 text-slate-700">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900">
                      Government College Prediction is currently available only for Science group students.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      You are a <strong>{prediction.group}</strong> student. This prediction system is designed only for Science group admission analysis.
                    </p>
                    <p className="text-xs text-slate-500 font-medium pt-0.5">
                      Please follow the official admission notice for your group.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setModalRoll(prediction.roll);
                  setIsModalOpen(true);
                }}
                className="w-full py-3.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-outfit text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-500/20"
              >
                <School className="w-4 h-4 text-amber-300" />
                <span>View Full Student Result & Marks Sheet</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/check-result?roll=${encodeURIComponent(prediction.roll)}`)}
                className="w-full py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-outfit text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-800"
              >
                <span>Check Board Rank & Marks →</span>
              </button>
            </div>

          </div>
        )}

        {/* Prediction Results Card (Science Students Only) */}
        {prediction && prediction.predictionAvailable !== false && prediction.group === 'Science' && (
          <div className="max-w-3xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-emerald-500/10 space-y-8 animate-in fade-in zoom-in-95 duration-300 font-jakarta">
            
            {/* Header / Student Tag */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Student Prediction Card
                  </span>
                  <h3 className="font-outfit font-extrabold text-xl sm:text-2xl text-slate-900">
                    {prediction.name || 'STUDENT RESULT'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
                  Roll: #{prediction.roll}
                </span>
                <span className="px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700">
                  Group: {prediction.group}
                </span>
                {prediction.gender && (
                  <span className="px-3 py-1 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-700">
                    Gender: {prediction.gender}
                  </span>
                )}
              </div>
            </div>

            {/* Main Result Display Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              {/* Board Rank Card */}
              <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl space-y-1 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500">
                  <span>Board Rank</span>
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="font-outfit font-black text-2xl sm:text-3xl text-emerald-600 tracking-tight">
                  #{prediction.rank}
                </div>
              </div>

              {/* Your Marks Card */}
              <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl space-y-1 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500">
                  <span>Your Marks</span>
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="font-outfit font-bold text-lg sm:text-xl text-slate-900">
                  {prediction.totalMarks ?? prediction.marks} / 1250
                </div>
              </div>

              {/* Last Cutoff Card */}
              <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl space-y-1 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500">
                  <span>Last Cutoff</span>
                  <Target className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="font-outfit font-bold text-lg sm:text-xl text-amber-700">
                  {prediction.lastCutoff ?? prediction.cutoff} Marks
                </div>
              </div>

              {/* Admission Chance Card */}
              <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl space-y-1 text-center flex flex-col justify-between items-center">
                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500">
                  <span>Chance</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div>
                  {prediction.chance ? getChanceBadge(prediction.chance) : null}
                </div>
              </div>

            </div>

            {/* Predicted College Highlight Card */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-amber-500/40 p-6 rounded-2xl space-y-3 relative overflow-hidden text-white shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                🎓 Your Possible Government College
              </span>

              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">{prediction.predictedCollege ? getCollegeIcon(prediction.predictedCollege) : '🏫'}</span>
                <h4 className="font-outfit font-black text-2xl sm:text-3xl text-white tracking-tight">
                  {prediction.predictedCollege}
                </h4>
              </div>

              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 font-medium">
                <div>
                  <span className="text-slate-400 block text-[11px]">Your Marks:</span>
                  <strong className="text-white text-sm">{prediction.totalMarks ?? prediction.marks} / 1250</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Last Cutoff:</span>
                  <strong className="text-amber-400 text-sm">{prediction.lastCutoff ?? prediction.cutoff} Marks</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Admission Chance:</span>
                  <strong className="text-emerald-400 text-sm">{prediction.chance}</strong>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setModalRoll(prediction.roll);
                  setIsModalOpen(true);
                }}
                className="w-full py-3.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-outfit text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-500/20"
              >
                <School className="w-4 h-4 text-amber-300" />
                <span>View Full Student Result & Marks Sheet</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/check-result?roll=${encodeURIComponent(prediction.roll)}`)}
                className="w-full py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-outfit text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-800"
              >
                <span>Check Board Rank & Marks →</span>
              </button>
            </div>

            {/* In-Card Quick Report Note */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-slate-600">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>⚠️ Wrong prediction or information?</span>
              </div>
              <a
                href="https://wa.me/8801867704636?text=Hello,%20I%20found%20an%20issue%20with%20the%20college%20prediction."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Report it on WhatsApp →</span>
              </a>
            </div>

          </div>
        )}

        {/* WhatsApp Feedback & Correction Support Card */}
        {prediction && prediction.predictionAvailable !== false && prediction.group === 'Science' && (
          <div className="max-w-3xl mx-auto bg-white border border-emerald-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-500/5 space-y-4 animate-in fade-in duration-300 font-jakarta">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Found any wrong information?</span>
                </div>
                <h4 className="font-outfit font-extrabold text-lg sm:text-xl text-slate-900">
                  Information Correction & Support
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  If you find any incorrect result, college prediction issue, or data mismatch, please contact us directly on WhatsApp.
                </p>
                <p className="text-xs sm:text-sm text-emerald-800 font-medium leading-relaxed font-jakarta">
                  আপনার রেজাল্ট, মার্কস বা কলেজ প্রেডিকশনে কোনো সমস্যা থাকলে সরাসরি WhatsApp এ যোগাযোগ করুন।
                </p>
              </div>

              <a
                href="https://wa.me/8801867704636?text=Hello,%20I%20found%20an%20issue%20with%20the%20college%20prediction."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-outfit text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 shrink-0 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-200" />
                <span>💬 Contact on WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* Government Colleges Cutoff Table */}
        <div className="max-w-4xl mx-auto space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-outfit font-black text-xl sm:text-2xl text-slate-900 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-indigo-600" />
                <span>Chittagong Science Group Government College Cutoffs</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Last admitted cutoff marks, total seats, gender eligibility, and predicted admission chance for Chittagong Govt. Colleges.
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold shrink-0 text-center">
              Max Total Marks: <span className="text-indigo-700 font-extrabold text-sm">1,250 Scale</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead className="bg-slate-900 text-white font-outfit text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-4">College</th>
                    <th className="py-4 px-4 text-center">Last Cutoff</th>
                    <th className="py-4 px-4 text-center">Seats</th>
                    <th className="py-4 px-4 text-center">Eligibility</th>
                    <th className="py-4 px-4 text-center">Your Chance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-jakarta text-slate-800">
                  {GOVT_COLLEGES.map((col) => {
                    const isPredicted = prediction && prediction.predictedCollege === col.name;
                    const computedChance = prediction
                      ? calculateCollegeChance(
                          prediction.totalMarks ?? prediction.marks ?? 0,
                          col.cutoff,
                          prediction.gender,
                          col.gender
                        )
                      : null;

                    return (
                      <tr
                        key={col.name}
                        className={`hover:bg-indigo-50/60 transition-colors ${
                          isPredicted ? 'bg-indigo-50/90 border-l-4 border-l-indigo-600 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-outfit font-bold text-slate-900 flex items-center gap-2">
                          <span>{col.medal}</span>
                          <span>{col.name}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-700 text-sm sm:text-base">
                          {col.cutoff} Marks
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                          {col.seats}
                        </td>
                        <td className="py-3.5 px-4 text-center font-jakarta font-medium text-slate-700">
                          {col.genderEligibility}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {computedChance ? (
                            getChanceBadge(computedChance)
                          ) : (
                            <span className="text-slate-400 font-mono text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Student Details Modal */}
      <StudentDetailsModal
        roll={modalRoll}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalRoll(null);
        }}
      />
    </div>
  );
};

export default CollegePrediction;

