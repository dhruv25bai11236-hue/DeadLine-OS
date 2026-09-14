import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight, Play, ShieldCheck } from 'lucide-react';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-white/50 backdrop-blur-sm border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-slate-900">
                  Deadline<span className="text-indigo-600">OS</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  AI v1.0
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide -mt-0.5">
                Academic Operating System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#priority-engine"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Priority Engine
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#simulator"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Live Simulator
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Live Demo Sandbox button */}
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-full transition-all hover:shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Play className="w-3 h-3 fill-emerald-700" />
              <span>Explore Demo</span>
            </Link>

            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Log in
            </Link>

            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/30 transition-all hover:shadow-md hover:scale-[1.02]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/demo"
              className="px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-full border border-emerald-200"
            >
              Demo
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-slate-100 mt-3 space-y-2">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              How It Works
            </a>
            <a
              href="#priority-engine"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Priority Engine
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Features
            </a>
            <a
              href="#simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Live Simulator
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              FAQ
            </a>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/demo"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200"
              >
                Launch Demo Sandbox
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-slate-600"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
