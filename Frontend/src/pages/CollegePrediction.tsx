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
  UserCheck,
} from 'lucide-react';
import { StudentDetailsModal } from '../components/StudentDetailsModal';

export interface PredictionData {
  name: string;
  roll: string;
  group: string;
  gender?: string;
  rank: number;
  predictedCollege: string;
  chance: string;
  seatRange: string;
}

export const GOVT_SCIENCE_COLLEGES_DATA = [
  {
    name: 'Chittagong College',
    seats: 660,
    genderEligibility: 'Male & Female',
    range: '1 – 660',
    chance: 'Very High',
    medal: '🥇',
  },
  {
    name: 'Govt. Hazi Muhammad Mohsin College, Chattogram',
    seats: 650,
    genderEligibility: 'Male & Female',
    range: '661 – 1,310',
    chance: 'Very High',
    medal: '🥈',
  },
  {
    name: 'Government City College',
    seats: 700,
    genderEligibility: 'Male & Female',
    range: '1,311 – 2,010',
    chance: 'High',
    medal: '🥉',
  },
  {
    name: "Chittagong Government Women's College",
    seats: 600,
    genderEligibility: 'Female Only',
    range: '2,011 – 2,610',
    chance: 'High',
    medal: '🏫',
  },
  {
    name: 'Bakalia Government College',
    seats: 450,
    genderEligibility: 'Male & Female',
    range: '2,611 – 3,060',
    chance: 'Moderate',
    medal: '🏫',
  },
  {
    name: 'Chattogram Govt. Model School & College',
    seats: 450,
    genderEligibility: 'Male & Female',
    range: '3,061 – 3,510',
    chance: 'Moderate',
    medal: '🏫',
  },
  {
    name: 'Chittagong Collegiate College',
    seats: 200,
    genderEligibility: 'Male Only',
    range: '3,511 – 3,710',
    chance: 'Moderate',
    medal: '🏫',
  },
  {
    name: 'Govt. Ashekane Awlia Degree College',
    seats: 100,
    genderEligibility: 'Male & Female',
    range: '3,711 – 3,810',
    chance: 'Moderate',
    medal: '🏫',
  },
];

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
      case 'excellent chance':
        return (
          <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Very High Chance
          </span>
        );
      case 'high':
      case 'good chance':
        return (
          <span className="px-3.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-xs">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            High Chance
          </span>
        );
      case 'moderate':
        return (
          <span className="px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            Moderate Chance
          </span>
        );
      default:
        return (
          <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs">
            <Info className="w-4 h-4 text-slate-500" />
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
            Estimate your possible government college admission chance based on Chittagong Board merit position.
          </p>
        </div>

        {/* Disclaimer Card */}
        <div className="max-w-4xl mx-auto bg-amber-50/90 border border-amber-200/80 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5 text-xs sm:text-sm text-slate-800 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-outfit font-extrabold text-amber-900 block mb-0.5">Disclaimer</span>
            <p className="text-amber-800 font-medium leading-relaxed">
              Disclaimer: This is an unofficial merit analytics platform based on publicly available Chittagong Board result data. Rankings are calculated using a 1250 marks scale and may differ from official board rankings.
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

        {/* Prediction Results Card */}
        {prediction && (
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
              </div>
            </div>

            {/* Main Result Display Grid (3 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Board Rank Card */}
              <div className="bg-slate-50/80 border border-slate-100 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Board Merit Rank</span>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                <div className="font-outfit font-black text-3xl sm:text-4xl text-emerald-600 tracking-tight">
                  #{prediction.rank}
                </div>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Chittagong Board Merit Position
                </span>
              </div>

              {/* Eligible Category / Gender Card */}
              <div className="bg-slate-50/80 border border-slate-100 p-5 rounded-2xl space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Eligible Category</span>
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <span className="font-outfit font-extrabold text-base sm:text-lg text-slate-900 block">
                    {prediction.gender || 'Male'} Science Student
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Gender-Scoped Seat Eligibility
                </span>
              </div>

              {/* Admission Chance Card */}
              <div className="bg-slate-50/80 border border-slate-100 p-5 rounded-2xl space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Admission Chance</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  {getChanceBadge(prediction.chance)}
                </div>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Seat Range: {prediction.seatRange}
                </span>
              </div>
            </div>

            {/* Predicted College Highlight Card */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-amber-500/40 p-6 rounded-2xl space-y-3 relative overflow-hidden text-white shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Estimated Possible Government College
              </span>

              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">{getCollegeIcon(prediction.predictedCollege)}</span>
                <h4 className="font-outfit font-black text-2xl sm:text-3xl text-white tracking-tight">
                  {prediction.predictedCollege}
                </h4>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-medium flex-wrap gap-2">
                <span>Prediction Based On: SSC '26 Estimated Merit Position</span>
                <span className="text-amber-400 font-bold">Chittagong Board Standard</span>
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
          </div>
        )}

        {/* Science Group Government Colleges Seat Table */}
        <div className="max-w-4xl mx-auto space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-outfit font-black text-xl sm:text-2xl text-slate-900 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-indigo-600" />
                <span>Chittagong Science Group Government College Seats</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Science seat breakdown, gender eligibility, and merit rank cutoff ranges for government colleges.
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold shrink-0 text-center">
              Total Science Seats: <span className="text-indigo-700 font-extrabold text-sm">3,810 Seats</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead className="bg-slate-900 text-white font-outfit text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-4 text-center">Rank Tier</th>
                    <th className="py-4 px-4">College Name</th>
                    <th className="py-4 px-4 text-center">Science Seats</th>
                    <th className="py-4 px-4 text-center">Gender Eligibility</th>
                    <th className="py-4 px-4 text-center">Merit Range</th>
                    <th className="py-4 px-4 text-center">Admission Chance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-jakarta text-slate-800">
                  {GOVT_SCIENCE_COLLEGES_DATA.map((col) => (
                    <tr
                      key={col.name}
                      className={`hover:bg-indigo-50/60 transition-colors ${
                        prediction && prediction.predictedCollege === col.name
                          ? 'bg-indigo-50/90 border-l-4 border-l-indigo-600'
                          : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-mono text-base">{col.medal}</td>
                      <td className="py-3.5 px-4 font-outfit font-bold text-slate-900">{col.name}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-indigo-600">{col.seats}</td>
                      <td className="py-3.5 px-4 text-center font-jakarta font-medium text-slate-700">
                        {col.genderEligibility}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-600">{col.range}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            col.chance === 'Very High'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : col.chance === 'High'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {col.chance}
                        </span>
                      </td>
                    </tr>
                  ))}
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
