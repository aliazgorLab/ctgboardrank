import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trophy, School, User, Award, BarChart3, BookOpen, Sparkles, Loader2, AlertCircle, FileCheck2, GraduationCap } from 'lucide-react';

export interface StudentSubject {
  code: string;
  subject: string;
  marks: number | string;
  grade: string;
}

export interface StudentDetailData {
  name: string;
  roll: string;
  registration?: string;
  gpa: number;
  achievement?: string;
  totalMarks: number;
  rankTotalMarks: number;
  coreSubjectMarks?: number;
  group: string;
  institution: string;
  rank: number;
  boardRank?: number;
  totalStudents?: string;
  subjects: StudentSubject[];
}

interface StudentDetailsModalProps {
  roll: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ roll, isOpen, onClose }) => {
  const [data, setData] = useState<StudentDetailData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen || !roll) {
      setData(null);
      setError(null);
      return;
    }

    const fetchStudentDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/rank/student/${encodeURIComponent(roll.trim())}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(`Student record for Roll '${roll}' was not found.`);
          }
          throw new Error('Unable to fetch student details. Please try again.');
        }

        const studentJson = await res.json();
        setData(studentJson);
      } catch (err: any) {
        console.error('Error loading student detail:', err);
        setError(err.message || 'Failed to load student result sheet.');
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentDetails();
  }, [isOpen, roll]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getGradeBadgeStyle = (grade: string) => {
    switch (grade.toUpperCase()) {
      case 'A+':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'A':
        return 'bg-blue-50 text-blue-700 border-blue-300';
      case 'A-':
        return 'bg-indigo-50 text-indigo-700 border-indigo-300';
      case 'B':
      case 'C':
      case 'D':
        return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'F':
        return 'bg-rose-50 text-rose-700 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const isTop3 = data ? data.rank <= 3 : false;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      
      {/* Dark Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-200 font-jakarta my-auto flex flex-col max-h-[90vh]">
        
        {/* Dark Navy Header Section */}
        <div className="bg-slate-900 text-white p-5 sm:p-7 relative overflow-hidden shrink-0">
          
          {/* Subtle Glow Background Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-bold">
                <FileCheck2 className="w-3.5 h-3.5" /> Official SSC'26 Student Result Sheet
              </div>
              
              <h2 className="font-outfit font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                {isLoading ? 'Loading Student Details...' : data ? data.name : `Roll Number: ${roll}`}
              </h2>
              
              {!isLoading && data && (
                <p className="text-xs sm:text-sm text-slate-300 font-medium flex items-center gap-1.5 flex-wrap">
                  <School className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{data.institution}</span>
                </p>
              )}
            </div>

            {/* Close Icon Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 border border-slate-700"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body Content */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-grow">
          
          {/* Loading State */}
          {isLoading && (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
              <p className="font-outfit font-bold text-slate-700 text-base">Fetching Real Student Data from Chittagong Board API...</p>
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 space-y-3 text-center">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <h3 className="font-outfit font-bold text-lg">Unable to Load Student Record</h3>
              <p className="text-sm font-medium">{error}</p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-outfit text-xs font-bold transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          )}

          {/* Data Loaded View */}
          {!isLoading && data && (
            <>
              {/* Student Metadata Info Cards (Grid) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                
                {/* Board Rank Card */}
                <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
                  isTop3 
                    ? 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-300 text-amber-950'
                    : 'bg-slate-50/80 border-slate-200 text-slate-900'
                }`}>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Board Rank</span>
                    <Trophy className={`w-4 h-4 ${isTop3 ? 'text-amber-600' : 'text-slate-400'}`} />
                  </div>
                  <div className="mt-2">
                    <span className={`font-outfit font-black text-2xl sm:text-3xl ${
                      isTop3 ? 'text-amber-700' : 'text-slate-900'
                    }`}>
                      #{data.rank}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-medium">Top Merit Standing</span>
                  </div>
                </div>

                {/* Rank Total Marks */}
                <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl flex flex-col justify-between text-slate-900">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Rank Total Marks</span>
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="mt-2">
                    <span className="font-outfit font-black text-2xl sm:text-3xl text-emerald-700">
                      {data.rankTotalMarks}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-medium">Out of 1250 Marks Scale</span>
                  </div>
                </div>

                {/* GPA Card */}
                <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl flex flex-col justify-between text-slate-900">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>GPA Result</span>
                    <Award className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="mt-2">
                    <span className="font-outfit font-black text-2xl sm:text-3xl text-slate-900">
                      {data.gpa.toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-medium">GPA Point Scale</span>
                  </div>
                </div>

                {/* Roll & Group */}
                <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl flex flex-col justify-between text-slate-900">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Roll & Group</span>
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="mt-2">
                    <span className="font-outfit font-bold text-lg text-slate-900 block font-mono">
                      {data.roll}
                    </span>
                    <span className="inline-block px-2 py-0.5 mt-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                      {data.group}
                    </span>
                  </div>
                </div>

              </div>

              {/* Extra Student Info Bar */}
              <div className="bg-slate-100/70 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-slate-600 font-medium">Full Name:</span>
                  <strong className="text-slate-900 font-bold font-outfit text-sm">{data.name}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-slate-600 font-medium">Achievement:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px]">
                    {data.achievement || (data.gpa === 5 ? 'Golden GPA 5' : `GPA ${data.gpa.toFixed(2)}`)}
                  </span>
                </div>
              </div>

              {/* Subject-Wise Results Table Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-outfit font-bold text-lg text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <span>Subject-wise Detailed Results</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    {data.subjects ? `${data.subjects.length} Subjects Registered` : ''}
                  </span>
                </div>

                {/* Subject Table Card Container */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      
                      {/* Sticky Table Header */}
                      <thead className="bg-slate-900 text-white font-outfit text-xs font-bold uppercase tracking-wider">
                        <tr>
                          <th className="py-3.5 px-4 text-center w-20">Code</th>
                          <th className="py-3.5 px-4">Subject Name</th>
                          <th className="py-3.5 px-4 text-center w-32">Marks</th>
                          <th className="py-3.5 px-4 text-center w-28">Grade</th>
                        </tr>
                      </thead>

                      {/* Table Body */}
                      <tbody className="divide-y divide-slate-100 text-xs font-jakarta">
                        {data.subjects && data.subjects.length > 0 ? (
                          data.subjects.map((sub) => (
                            <tr key={sub.code} className="hover:bg-slate-50/80 transition-colors">
                              
                              {/* Subject Code */}
                              <td className="py-3 px-4 text-center font-mono font-bold text-slate-500">
                                {sub.code}
                              </td>

                              {/* Subject Name */}
                              <td className="py-3 px-4 font-outfit font-bold text-slate-900 text-sm">
                                {sub.subject}
                              </td>

                              {/* Marks Obtained */}
                              <td className="py-3 px-4 text-center font-outfit font-extrabold text-slate-900 text-sm">
                                {sub.marks !== undefined && sub.marks !== null ? sub.marks : '—'}
                              </td>

                              {/* Grade Badge */}
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-block px-3 py-1 rounded-full border text-xs font-black font-outfit min-w-[42px] ${getGradeBadgeStyle(sub.grade)}`}>
                                  {sub.grade || '—'}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-slate-500 font-medium">
                              No subject details found for this student.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer Bar */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <p className="text-slate-500 text-center sm:text-left font-medium">
            Unofficial Merit Analytics Portal • Chittagong Education Board SSC 2026
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            {data && (
              <button
                onClick={() => {
                  navigate(`/college-prediction?roll=${encodeURIComponent(data.roll)}`);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-outfit font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <span>🎓 Check Govt College Chance</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-outfit font-bold text-xs transition-colors cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
