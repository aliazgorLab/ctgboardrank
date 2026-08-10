import React, { useState, useEffect } from 'react';
import { Trophy, Filter, Loader2, School, AlertTriangle, ExternalLink, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ScholarshipOfferCard } from '../components/ScholarshipOfferCard';

export interface LeaderboardStudent {
  rank: number;
  name: string;
  roll: string;
  gpa: number;
  achievement?: string;
  group: string;
  totalMarks: number;
  rankTotalMarks?: number;
  institution: string;
}

const GROUPS = ['All', 'Science', 'Humanities', 'Business Studies'] as const;
type GroupOption = (typeof GROUPS)[number];

const ITEMS_PER_PAGE = 100;

export const Leaderboard: React.FC = () => {
  const [students, setStudents] = useState<LeaderboardStudent[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupOption>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.removeItem('leaderboardCache');
      sessionStorage.removeItem('leaderboardCache');
    } catch {
      // Ignore
    }

    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        let url = `${baseUrl}/api/rank/leaderboard?limit=1000&_t=${Date.now()}`;
        if (selectedGroup !== 'All') {
          url += `&group=${encodeURIComponent(selectedGroup)}`;
        }

        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('No leaderboard data available');
        }

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setStudents(data);
        } else {
          setStudents([]);
          setError('No leaderboard data available');
        }
      } catch (err: any) {
        console.error('Error loading leaderboard:', err);
        setError('No leaderboard data available');
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
    setCurrentPage(1);
  }, [selectedGroup]);

  const handleViewDetails = (roll: string) => {
    navigate(`/?roll=${encodeURIComponent(roll)}`);
  };

  const top1 = students.find((s) => s.rank === 1);
  const top2 = students.find((s) => s.rank === 2);
  const top3 = students.find((s) => s.rank === 3);

  const totalPages = Math.max(1, Math.ceil(students.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = students.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const tableElem = document.getElementById('leaderboard-table-card');
      if (tableElem) {
        tableElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div id="leaderboard" className="min-h-[calc(100vh-140px)] py-10 sm:py-14 lg:py-16 bg-slate-50 font-jakarta relative overflow-hidden flex flex-col justify-center">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-amber-100/20 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold tracking-wide">
            <Trophy className="w-3.5 h-3.5 text-amber-600" /> Chittagong Board Top 1000 Standings
          </div>
          <h1 className="font-outfit font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
            SSC '26 Board Leaderboard
          </h1>
          <p className="font-jakarta text-base text-slate-600 font-medium">
            Top 1000 examinees across Chittagong Board ranked by Adjusted Total Marks (max 1300), GPA, Core Subject Marks, and Roll.
          </p>
        </div>

        {/* Group Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Group Filter:
          </div>
          {GROUPS.map((grp) => {
            const isSelected = selectedGroup === grp;
            return (
              <button
                key={grp}
                onClick={() => setSelectedGroup(grp)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {grp === 'All' ? 'All Groups' : grp}
              </button>
            );
          })}
        </div>

        {/* Top 3 Podium Display */}
        {!isLoading && !error && students.length >= 3 && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 font-jakarta">
            
            {/* 🥈 2nd Place */}
            {top2 && (
              <div className="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-lg flex flex-col justify-between hover:border-slate-400 transition-all md:translate-y-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-outfit text-slate-700 flex items-center gap-1.5">
                      🥈 2nd
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold font-mono">
                      GPA {top2.gpa.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-outfit font-bold text-lg text-slate-900 line-clamp-1">{top2.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{top2.institution}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Rank Total Marks</span>
                    <span className="text-lg font-black font-outfit text-slate-900">
                      {top2.rankTotalMarks || top2.totalMarks + 150}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleViewDetails(top2.roll)}
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-outfit text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* 🥇 1st Place */}
            {top1 && (
              <div className="bg-gradient-to-b from-amber-500/10 via-white to-white rounded-2xl border-2 border-amber-400 p-6 shadow-xl shadow-amber-500/10 flex flex-col justify-between transform md:-translate-y-2 relative">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-outfit text-[11px] font-black uppercase tracking-wider shadow-md">
                  Board Rank #1
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black font-outfit text-amber-600 flex items-center gap-1.5">
                      🥇 1st
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black font-mono">
                      GPA {top1.gpa.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-outfit font-black text-xl text-slate-900 line-clamp-1">{top1.name}</h3>
                    <p className="text-xs text-slate-600 font-medium line-clamp-1 mt-0.5">{top1.institution}</p>
                  </div>
                  <div className="pt-2 border-t border-amber-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">Rank Total Marks</span>
                    <span className="text-xl font-black font-outfit text-amber-600">
                      {top1.rankTotalMarks || top1.totalMarks + 150}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleViewDetails(top1.roll)}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-outfit text-xs font-black flex items-center justify-center gap-1 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* 🥉 3rd Place */}
            {top3 && (
              <div className="bg-white rounded-2xl border-2 border-amber-700/30 p-5 shadow-lg flex flex-col justify-between hover:border-amber-700/60 transition-all md:translate-y-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-outfit text-amber-800 flex items-center gap-1.5">
                      🥉 3rd
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold font-mono">
                      GPA {top3.gpa.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-outfit font-bold text-lg text-slate-900 line-clamp-1">{top3.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{top3.institution}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Rank Total Marks</span>
                    <span className="text-lg font-black font-outfit text-amber-900">
                      {top3.rankTotalMarks || top3.totalMarks + 150}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleViewDetails(top3.roll)}
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-outfit text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>
        )}

        {/* Disclaimer Card */}
        <div className="max-w-4xl mx-auto bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm font-medium leading-relaxed">
            <strong className="font-bold">Disclaimer:</strong> This is not an official Chittagong Education Board website or official ranking. This unofficial merit analytics portal is created based on publicly available result data for analysis purposes only. For official results and marksheets, please visit the official board website.
          </p>
        </div>

        {/* Leaderboard Table Card Container */}
        <div id="leaderboard-table-card" className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/60 overflow-hidden space-y-0">
          
          {/* Scrollable Table Box */}
          <div className="max-h-[650px] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <table className="w-full text-left border-collapse min-w-[640px] sm:min-w-full">
              
              {/* Sticky Dark Table Header */}
              <thead className="sticky top-0 z-10 bg-slate-900 text-white font-outfit text-xs sm:text-sm font-bold shadow-sm uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-3 sm:px-4 text-center w-16 sm:w-20">Rank</th>
                  <th className="py-4 px-4 sm:px-6">Student</th>
                  <th className="py-4 px-4 sm:px-6 hidden md:table-cell">Institution</th>
                  <th className="py-4 px-3 sm:px-4 text-center">GPA</th>
                  <th className="py-4 px-3 sm:px-4 text-right">Rank Total Marks</th>
                  <th className="py-4 px-3 sm:px-4 text-center">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100 font-jakarta text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                        <span className="font-outfit font-semibold text-slate-700">Loading Top 1000 Leaderboard...</span>
                      </div>
                    </td>
                  </tr>
                ) : error || students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-500 font-medium">
                      {error || 'No leaderboard data available'}
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((student) => {
                    const isRank1 = student.rank === 1;
                    const isRank2 = student.rank === 2;
                    const isRank3 = student.rank === 3;
                    const displayRankTotal = student.rankTotalMarks || (student.totalMarks + 150);

                    return (
                      <tr
                        key={`${student.roll}-${student.rank}`}
                        className={`transition-colors hover:bg-slate-50/80 ${
                          isRank1
                            ? 'bg-amber-500/10 border-l-4 border-amber-500 font-semibold'
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
                              {isRank1 ? '🥇 1st' : isRank2 ? '🥈 2nd' : isRank3 ? '🥉 3rd' : `#${student.rank}`}
                            </span>
                          </div>
                        </td>

                        {/* 2. Student Name Column */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex flex-col">
                            <span className="font-outfit font-bold text-slate-900 sm:text-base">
                              {student.name && student.name.trim() !== '' ? student.name : 'N/A'}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              Roll: {student.roll} • {student.group || 'Science'}
                            </span>
                            <span className="md:hidden text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <School className="w-3 h-3 text-slate-400 shrink-0" />
                              {student.institution || 'Chittagong Education Board'}
                            </span>
                          </div>
                        </td>

                        {/* 3. Institution Column (Desktop) */}
                        <td className="py-4 px-4 sm:px-6 hidden md:table-cell text-slate-600 text-xs font-semibold max-w-[220px] truncate">
                          {student.institution || 'Chittagong Education Board'}
                        </td>

                        {/* 4. GPA Column */}
                        <td className="py-4 px-3 sm:px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-bold whitespace-nowrap">
                            {typeof student.gpa === 'number' ? student.gpa.toFixed(2) : student.gpa}
                          </span>
                        </td>

                        {/* 5. Rank Total Marks Column */}
                        <td className="py-4 px-3 sm:px-4 text-right font-outfit font-extrabold text-slate-900 text-base">
                          {displayRankTotal}
                        </td>

                        {/* 6. Action Column */}
                        <td className="py-4 px-3 sm:px-4 text-center">
                          <button
                            onClick={() => handleViewDetails(student.roll)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-outfit text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                          >
                            <span>View Details</span>
                            <ExternalLink className="w-3 h-3 text-amber-400" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination & Table Footer Stats */}
          {!isLoading && !error && students.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
              <div className="text-slate-600">
                Showing <span className="font-bold text-slate-900">{startIndex + 1}</span>–<span className="font-bold text-slate-900">{Math.min(startIndex + ITEMS_PER_PAGE, students.length)}</span> of <span className="font-bold text-slate-900">{students.length}</span> Top Merit Examinees
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                    const isCurrent = pg === currentPage;
                    return (
                      <button
                        key={pg}
                        onClick={() => handlePageChange(pg)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {pg}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Bottom CTA Banner Component */}
        <div className="max-w-4xl mx-auto pt-4">
          <ScholarshipOfferCard />
        </div>

      </div>
    </div>
  );
};
