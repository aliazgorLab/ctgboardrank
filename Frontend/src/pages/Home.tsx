import { useState } from 'react';
import { Hero } from '../components/Hero';
import { RankForm } from '../components/RankForm';
import { ResultCard } from '../components/ResultCard';
import type { ResultData } from '../components/ResultCard';
import { PromoSection } from '../components/PromoSection';
import { ResultScholarshipModal } from '../components/ResultScholarshipModal';

export function Home() {
  const [studentData, setStudentData] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchRank = async (roll: string) => {
    setIsLoading(true);
    setError(null);

    const minDelayPromise = new Promise((resolve) => setTimeout(resolve, 1000));

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
        name: data.name && data.name.trim() !== '' ? data.name : 'Student',
        roll: data.roll || roll,
        reg: data.registration || 'N/A',
        gpa: typeof data.gpa === 'number' ? data.gpa : (parseFloat(data.gpa) || 5.0),
        achievement: data.achievement || (Number(data.gpa) === 5 ? 'Golden GPA 5' : `GPA ${Number(data.gpa).toFixed(2)}`),
        marks: data.totalMarks || data.marks || '1120',
        rank: data.boardRank || data.rank || '1',
        totalStudents: data.totalStudents || '142,000+',
      });
    } catch (err: any) {
      console.error('Error fetching student rank:', err);
      setError(err.message || 'Failed to fetch board rank.');
      setStudentData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStudentData(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Dynamic Section: Form or Result Card */}
      {studentData ? (
        <section id="rank-checker" className="py-16 lg:py-24 bg-slate-50 font-jakarta relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ResultCard data={studentData} onReset={handleReset} />
          </div>
        </section>
      ) : (
        <RankForm
          onSubmit={handleFetchRank}
          isLoading={isLoading}
          error={error}
        />
      )}

      {/* Promotional Section for Zahid's Chem Clinic */}
      <PromoSection />

      {/* 5-Second Post-Result Search Scholarship Modal */}
      <ResultScholarshipModal isResultLoaded={!!studentData} />
    </>
  );
}

export default Home;
