import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RankForm } from '../components/RankForm';
import { ResultCard } from '../components/ResultCard';
import type { ResultData } from '../components/ResultCard';
import { PromoSection } from '../components/PromoSection';
import { ResultScholarshipModal } from '../components/ResultScholarshipModal';
import { StudentDetailsModal } from '../components/StudentDetailsModal';
import { Sparkles } from 'lucide-react';

export const CheckResult: React.FC = () => {
  const [studentData, setStudentData] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalRoll, setModalRoll] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const location = useLocation();

  const handleFetchRank = async (roll: string) => {
    setIsLoading(true);
    setError(null);

    const minDelayPromise = new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const responsePromise = fetch(`${baseUrl}/api/rank/${encodeURIComponent(roll.trim())}`);
      
      const [response] = await Promise.all([responsePromise, minDelayPromise]);

      if (!response.ok) {
        if (response.status === 404) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Roll number '${roll}' was not found in Chittagong Board SSC 2026 records.`);
        }
        throw new Error('Unable to connect to Chittagong Board result server. Please try again.');
      }

      const data = await response.json();

      setStudentData({
        name: data.name && data.name.trim() !== '' ? data.name : 'N/A',
        roll: data.roll || roll,
        reg: data.registration || 'N/A',
        gpa: typeof data.gpa === 'number' ? data.gpa : (parseFloat(data.gpa) || 5.0),
        achievement: data.achievement || (Number(data.gpa) === 5 ? 'Golden GPA 5' : `GPA ${Number(data.gpa).toFixed(2)}`),
        marks: data.rankTotalMarks || data.totalMarks || data.marks || '1120',
        rank: data.boardRank || data.rank || '1',
        totalStudents: data.totalStudents || '126,914',
      });
    } catch (err: any) {
      console.error('Error fetching student rank:', err);
      setError(err.message || 'Failed to fetch board rank.');
      setStudentData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Support direct query param ?roll=112257
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const rollParam = params.get('roll');
    if (rollParam && rollParam.trim() !== '') {
      handleFetchRank(rollParam);
    }
  }, [location.search]);

  const handleReset = () => {
    setStudentData(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] py-10 sm:py-14 lg:py-16 bg-slate-50 font-jakarta relative overflow-hidden flex flex-col justify-center">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-indigo-100/20 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Chittagong Board Official Merit System
          </div>
          <h1 className="font-outfit font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
            SSC '26 Board Rank & Result Checker
          </h1>
          <p className="font-jakarta text-base text-slate-600 font-medium">
            Enter your SSC Roll number below to view your estimated board merit position, GPA, and complete individual subject-wise marks breakdown.
          </p>
        </div>

        {/* Search Form or Result Card */}
        <div id="rank-checker" className="w-full">
          {studentData ? (
            <div className="animate-in fade-in duration-300">
              <ResultCard 
                data={studentData} 
                onReset={handleReset}
                onViewDetails={(roll) => {
                  setModalRoll(roll);
                  setIsModalOpen(true);
                }}
              />
            </div>
          ) : (
            <RankForm
              onSubmit={handleFetchRank}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>

        {/* Promotional Section */}
        <PromoSection />

        {/* 5-Second Post-Result Search Scholarship Modal */}
        <ResultScholarshipModal isResultLoaded={!!studentData} />

        {/* Full Student Result Details Modal */}
        <StudentDetailsModal
          roll={modalRoll}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setModalRoll(null);
          }}
        />

      </div>
    </div>
  );
};

export default CheckResult;
