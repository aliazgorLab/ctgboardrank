import React, { useState, useEffect } from 'react';
import { Trophy, Award, ArrowRight, Beaker, Filter, Loader2, School, AlertTriangle } from 'lucide-react';
import { ScholarshipOfferCard } from '../components/ScholarshipOfferCard';

export interface LeaderboardStudent {
  rank: number;
  name: string;
  roll: string;
  gpa: number;
  achievement?: string;
  group: string;
  totalMarks: number;
  institution: string;
}

const GROUPS = ['All', 'Science', 'Humanities', 'Business Studies'] as const;
type GroupOption = (typeof GROUPS)[number];

export const Leaderboard: React.FC = () => {
  const [students, setStudents] = useState<LeaderboardStudent[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupOption>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        let url = `${baseUrl}/api/rank/leaderboard?limit=100`;
        if (selectedGroup !== 'All') {
          url += `&group=${encodeURIComponent(selectedGroup)}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Failed to load leaderboard records');
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          setStudents([]);
        }
      } catch (err: any) {
        console.error('Error loading leaderboard:', err);
        setError('Unable to fetch live leaderboard data. Please check backend connection.');
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedGroup]);

  const getGroupBadgeColor = (group: string) => {
    switch (group) {
      case 'Science':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Humanities':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Business Studies':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="leaderboard" className="min-h-[calc(100vh-140px)] py-10 sm:py-14 lg:py-16 bg-slate-50 font-jakarta relative overflow-hidden flex flex-col justify-center">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-amber-100/20 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold tracking-wide">
            <Trophy className="w-3.5 h-3.5 text-amber-500" /> 🏆 Live Merit Standings
          </div>
          
          <h1 className="font-outfit font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight">
            Chittagong Board Top Merit List
          </h1>

          <p className="font-jakarta text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto">
            The brightest minds of SSC Batch '26. Top rankers are eligible for a <strong className="text-indigo-600 font-bold">50% scholarship</strong> at Zahid's Chem Clinic.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700 text-sm font-bold">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Filter by Group:</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value as GroupOption)}
              className="w-full sm:w-48 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition cursor-pointer"
            >
              {GROUPS.map((grp) => (
                <option key={grp} value={grp}>
                  {grp === 'All' ? 'All Groups' : grp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Disclaimer Alert Box */}
        <div className="max-w-4xl mx-auto bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 text-amber-900 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm font-medium leading-relaxed">
            <strong className="font-bold">Disclaimer:</strong> This is not an official ranking published by the Chittagong Education Board. This ranking is independently prepared based on publicly available result data and academic performance metrics. Actual official rankings may vary.
          </p>
        </div>

        {/* Leaderboard Table Card Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/60 overflow-hidden space-y-0">
          
          {/* Scrollable Table Box */}
          <div className="max-h-[600px] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <table className="w-full text-left border-collapse min-w-[640px] sm:min-w-full">
              
              {/* Sticky Dark Table Header */}
              <thead className="sticky top-0 z-10 bg-slate-900 text-white font-outfit text-xs sm:text-sm font-bold shadow-sm uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-3 sm:px-4 text-center w-16 sm:w-20">Rank</th>
                  <th className="py-4 px-4 sm:px-6">Name</th>
                  <th className="py-4 px-3 sm:px-4 text-center">Roll</th>
                  <th className="py-4 px-3 sm:px-4 text-center">GPA</th>
                  <th className="py-4 px-3 sm:px-4 text-center">Group</th>
                  <th className="py-4 px-3 sm:px-4 text-right">Total</th>
                  <th className="py-4 px-4 sm:px-6 hidden md:table-cell">Institution</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        <span className="font-outfit font-semibold text-sm">Fetching live leaderboard rankings...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-rose-600 font-medium">
                      {error}
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                      No rank records found for group '{selectedGroup}'.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => {
                    const isRank1 = student.rank === 1;
                    const isRank2 = student.rank === 2;
                    const isRank3 = student.rank === 3;

                    return (
                      <tr
                        key={student.roll}
                        className={`transition-colors hover:bg-slate-50/80 ${
                          isRank1
                            ? 'bg-amber-500/10 border-l-4 border-amber-500'
                            : isRank2
                            ? 'bg-slate-100/70 border-l-4 border-slate-400'
                            : isRank3
                            ? 'bg-amber-700/10 border-l-4 border-amber-700'
                            : ''
                        }`}
                      >
                        {/* 1. Rank Column */}
                        <td className="py-4 px-3 sm:px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {isRank1 && <Trophy className="w-4 h-4 text-amber-500 shrink-0" />}
                            {isRank2 && <Award className="w-4 h-4 text-slate-400 shrink-0" />}
                            {isRank3 && <Award className="w-4 h-4 text-amber-700 shrink-0" />}
                            <span
                              className={`font-outfit font-extrabold ${
                                isRank1
                                  ? 'text-amber-700 text-base'
                                  : isRank2
                                  ? 'text-slate-700 text-base'
                                  : isRank3
                                  ? 'text-amber-800 text-base'
                                  : 'text-slate-600'
                              }`}
                            >
                              #{student.rank}
                            </span>
                          </div>
                        </td>

                        {/* 2. Name Column */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex flex-col">
                            <span className="font-outfit font-bold text-slate-900 sm:text-base">
                              {student.name && student.name.trim() !== '' ? student.name : 'N/A'}
                            </span>
                            <span className="md:hidden text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <School className="w-3 h-3 text-slate-400 shrink-0" />
                              {student.institution || 'Chittagong Govt. High School'}
                            </span>
                          </div>
                        </td>

                        {/* 3. Roll Column */}
                        <td className="py-4 px-3 sm:px-4 text-center font-mono font-semibold text-slate-600">
                          {student.roll}
                        </td>

                        {/* 4. GPA Column */}
                        <td className="py-4 px-3 sm:px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-bold whitespace-nowrap">
                            {typeof student.gpa === 'number' ? student.gpa.toFixed(2) : student.gpa}
                          </span>
                        </td>

                        {/* 5. Group Column */}
                        <td className="py-4 px-3 sm:px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full border text-xs font-bold whitespace-nowrap ${getGroupBadgeColor(student.group)}`}>
                            {student.group || 'Science'}
                          </span>
                        </td>

                        {/* 6. Total Marks Column */}
                        <td className="py-4 px-3 sm:px-4 text-right font-outfit font-bold text-slate-900 sm:text-base">
                          {student.totalMarks}
                        </td>

                        {/* 7. Institution Column (visible on md+) */}
                        <td className="py-4 px-4 sm:px-6 hidden md:table-cell text-slate-600 font-medium text-xs sm:text-sm">
                          {student.institution || 'Chittagong Govt. High School'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

            </table>
          </div>

          {/* Zahid's Chem Clinic Promo Banner Overlay */}
          <div className="p-4 sm:p-5 bg-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-indigo-800">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="p-2 rounded-xl bg-indigo-800 text-indigo-200 shrink-0 hidden sm:block">
                <Beaker className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-outfit font-bold text-sm text-white">
                  Made the Top Merit List? Claim your Zahid's Chem Clinic Elite Scholarship
                </h4>
                <p className="text-xs text-indigo-200 font-medium">
                  Exclusive 50% discount for top Chittagong Board rank holders.
                </p>
              </div>
            </div>

            <a
              href="/#zahid-chem-clinic"
              className="font-outfit font-bold text-xs sm:text-sm text-indigo-950 bg-white hover:bg-slate-100 px-5 py-2.5 rounded-xl shadow transition-transform hover:scale-105 flex items-center gap-1.5 shrink-0"
            >
              Claim Scholarship
              <ArrowRight className="w-3.5 h-3.5 text-indigo-950" />
            </a>
          </div>

          {/* Bangla Scholarship Offer Card Below Leaderboard */}
          <div className="max-w-4xl mx-auto pt-4">
            <ScholarshipOfferCard />
          </div>

        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
