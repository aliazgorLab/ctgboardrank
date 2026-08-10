import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Beaker, Menu, X, ArrowRight, Sparkles, Trophy, BookOpen } from 'lucide-react';
import logo from '../assets/logo.png';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all font-jakarta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Side: Logo & Branding */}
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 group focus:outline-none cursor-pointer">
            <img
              src={logo}
              alt="CTG Board Rank Logo"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-outfit text-xl font-extrabold tracking-tight text-slate-900">
                  CTG Rank <span className="text-indigo-600 italic">Checker</span>
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/70 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-600" /> SSC Batch '26
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 tracking-wide">
                Chittagong Board Official Standard
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="/#rank-checker" 
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Check Rank
            </a>
            <Link 
              to="/leaderboard" 
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              Leaderboard
            </Link>
            <Link 
              to="/zahid-chem-clinic" 
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5 group"
            >
              <Beaker className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
              Zahid's Chem Clinic
            </Link>
            <a 
              href="/#hsc-batches" 
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              HSC Batches
            </a>
          </nav>

          {/* Right Side: Prominent CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/zahid-chem-clinic"
              className="font-outfit px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2 group"
            >
              Join Chem Clinic
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Burger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 font-jakarta">
          <a
            href="/#rank-checker"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
          >
            Check Rank
          </a>
          <Link
            to="/leaderboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            Leaderboard
          </Link>
          <Link
            to="/zahid-chem-clinic"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
          >
            <Beaker className="w-4 h-4 text-indigo-600" />
            Zahid's Chem Clinic
          </Link>
          <a
            href="/#hsc-batches"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            HSC Batches
          </a>
          <div className="pt-2">
            <Link
              to="/zahid-chem-clinic"
              onClick={() => setMobileMenuOpen(false)}
              className="font-outfit w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-slate-900 rounded-xl shadow-sm"
            >
              Join Chem Clinic
              <ArrowRight className="w-4 h-4 text-slate-300" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
