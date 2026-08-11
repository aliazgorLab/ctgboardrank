import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { CheckResult } from './pages/CheckResult';
import { Leaderboard } from './pages/Leaderboard';
import { ZahidChemClinic } from './pages/ZahidChemClinic';
import { CollegePrediction } from './pages/CollegePrediction';
import { ScholarshipPopup } from './components/ScholarshipPopup';
import { ScholarshipClaimModal } from './components/ScholarshipClaimModal';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
        {/* Persistent Sticky Navbar */}
        <Navbar />

        {/* Dynamic Route Pages */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/check-result" element={<CheckResult />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/college-prediction" element={<CollegePrediction />} />
            <Route path="/zahid-chem-clinic" element={<ZahidChemClinic />} />
          </Routes>
        </main>

        {/* Floating Bangla Scholarship Offer Popup */}
        <ScholarshipPopup />

        {/* Global Claim Scholarship Form & Card Modal */}
        <ScholarshipClaimModal />

        {/* Persistent Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
