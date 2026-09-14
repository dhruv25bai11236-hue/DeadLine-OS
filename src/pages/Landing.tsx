import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Brain,
  Calendar,
  Clock,
  RefreshCw,
  BarChart3,
  FileText,
  ChevronDown,
  Star,
  Play,
  Layers,
  Flame,
  Check,
  Award,
  BookOpen,
  MousePointerClick,
  Sliders,
  Eye,
  ChevronUp,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { HeroScene } from '../components/3d/HeroScene';
import { LiveSimulator } from '../components/landing/LiveSimulator';
import { PriorityPlayground } from '../components/landing/PriorityPlayground';

export default function Landing() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [featureCategory, setFeatureCategory] = useState<string>('all');
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([0, 1]); // Top questions open upfront!

  const toggleFaq = (index: number) => {
    if (expandedFaqs.includes(index)) {
      setExpandedFaqs(expandedFaqs.filter((i) => i !== index));
    } else {
      setExpandedFaqs([...expandedFaqs, index]);
    }
  };

  const expandAllFaqs = () => {
    setExpandedFaqs([0, 1, 2, 3, 4]);
  };

  const collapseAllFaqs = () => {
    setExpandedFaqs([]);
  };

  const steps = [
    {
      num: '01',
      title: 'Multi-Format Ingest',
      desc: 'Drop raw PDFs, course syllabi, rubric files, or assignment prompt text. No manual calendar data entry.',
      detail: 'Supports PDF, DOCX, Markdown, Canvas announcements, and raw syllabus text dumps.',
      previewExample: 'Input: "CS 106B Final Exam on Dec 14 at 7pm, worth 35% of grade with 6 problem sets prior."',
      icon: FileText,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      num: '02',
      title: 'AI Decomposition',
      desc: 'GPT-4o parses deliverables into actionable 30–90 minute chunks with estimated cognitive complexity.',
      detail: 'Generates progressive milestones (Research → Draft → Solve → Review) with verified hourly estimates.',
      previewExample: 'Decomposed: 4 Subtasks • 12.5 Estimated Study Hours • Cognitive Difficulty: High (85/100)',
      icon: Sparkles,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      num: '03',
      title: 'Deterministic Priority',
      desc: 'Mathematical engine calculates priority scores (0-100) weighting urgency, difficulty, and conflict risk.',
      detail: 'Zero hallucinated rankings. Strict formula ensures critical finals always take precedence over light quizzes.',
      previewExample: 'Calculated Score: 87.5/100 (Critical Priority) • Urgency 92% • Workload 85% • Risk 80%',
      icon: Brain,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      num: '04',
      title: 'Timeline Construction',
      desc: 'Automatically slots study blocks into your designated weekly availability, capped at max 2-hour blocks.',
      detail: 'Protects gym time, sleep, and personal hours while guaranteeing all coursework is completed on time.',
      previewExample: 'Allocated: 6 Focused Study Blocks slotted across Tuesday, Thursday, and Saturday afternoons.',
      icon: Calendar,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      num: '05',
      title: 'Adaptive Rebalancing',
      desc: 'Life happened and you missed a block? One click recalculates downstream commitments without panic.',
      detail: 'Smart ripple engine shifts uncompleted blocks into available future slots with zero schedule collisions.',
      previewExample: 'Rebalance Action: 1-Click shifted missed Tuesday block to Wednesday morning; preserved sleep window.',
      icon: RefreshCw,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
  ];

  const features = [
    {
      category: 'scheduling',
      icon: Calendar,
      title: 'Multi-View Interactive Timeline',
      desc: 'Toggle seamlessly between an interactive 3D Node Orbit, a weekly calendar grid, and chronological task lists.',
      badge: '3D Node Engine',
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      category: 'scheduling',
      icon: RefreshCw,
      title: 'Automated Continuous Replanning',
      desc: 'Missed a study session? One click reallocates downstream commitments into available future slots with zero conflict.',
      badge: 'One-Click Rebalance',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      category: 'focus',
      icon: Clock,
      title: 'Deep Focus Pomodoro Timer',
      desc: 'Integrated Pomodoro mode logs actual study duration vs. AI estimates, continuously refining future workload accuracy.',
      badge: 'Study Tracker',
      color: 'text-purple-600 bg-purple-50',
    },
    {
      category: 'security',
      icon: ShieldCheck,
      title: 'Supabase Row-Level Security',
      desc: 'Your syllabi, grades, and schedules belong exclusively to you. Enforced directly at the PostgreSQL database engine level.',
      badge: 'Strict RLS',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      category: 'scheduling',
      icon: FileText,
      title: 'High-Resolution PDF & CSV Export',
      desc: 'Generate printable high-resolution PDF schedules or download CSV files ready to sync into Google Calendar or Notion.',
      badge: 'Universal Export',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      category: 'focus',
      icon: BarChart3,
      title: 'Velocity & Burnout Analytics',
      desc: 'Track completion funnels, weekly study velocity, on-time rates, and identify courses demanding disproportionate effort.',
      badge: 'Live Metrics',
      color: 'text-rose-600 bg-rose-50',
    },
  ];

  const filteredFeatures =
    featureCategory === 'all'
      ? features
      : features.filter((f) => f.category === featureCategory);

  const faqs = [
    {
      q: 'Can I test DeadlineOS AI without signing up or setting up API keys?',
      a: 'Yes! Click "Explore Demo" in the navigation bar to launch our complete in-memory interactive sandbox. It comes pre-loaded with sample university coursework, a live schedule, and focus timers.',
    },
    {
      q: 'How does the AI extract tasks from my syllabus?',
      a: 'Our backend uses the OpenAI API with structured JSON schemas (zodResponseFormat). It scans your document text for deliverables, weighting percentages, deadlines, and generates sequential subtasks with recommended study hours.',
    },
    {
      q: 'What happens if I fall behind on my schedule?',
      a: 'Click "Replan Schedule" on your timeline. The deterministic scheduler takes your remaining available slots, recalculates urgency curves, and redistributes uncompleted blocks without overlapping your other commitments.',
    },
    {
      q: 'Is my academic data and syllabus private?',
      a: 'Absolutely. We use Supabase with PostgreSQL Row-Level Security (RLS). Only your authenticated session can query or view your assignments and schedule.',
    },
    {
      q: 'Can I export my schedule to external calendars or print it?',
      a: 'Yes. With one click, export your study blocks as formatted PDFs or CSV files ready to import into Google Calendar, Apple Calendar, or Notion.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500 selection:text-white relative">
      {/* Top Glassmorphic Navigation Bar */}
      <Navbar />

      {/* ========================================================================= */}
      {/* HERO SECTION — ALL TEXT FULLY VISIBLE & PROMINENT */}
      {/* ========================================================================= */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-50/90 via-white to-slate-50/50">
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-60" />

        {/* 3D Interactive Scene Container (Framed gracefully around text) */}
        <HeroScene />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Luminous Frosted Hero Card for Supreme Readability & Contrast */}
            <div className="hero-glow-backdrop rounded-3xl p-6 sm:p-10 border border-white/90 shadow-[0_20px_50px_-15px_rgba(99,102,241,0.08)]">
              {/* Category Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/95 border border-indigo-200/90 text-indigo-900 text-xs font-bold mb-6 shadow-sm hover:scale-105 transition-transform cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Autonomous Academic Operating System</span>
                <span className="w-1 h-1 rounded-full bg-indigo-300" />
                <span className="text-indigo-700 font-extrabold uppercase tracking-wide text-[10px]">
                  Powered by GPT-4o
                </span>
              </div>

              {/* Kinetic Typography Main Headline — High Impact & Highlighted */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 leading-[1.08] mb-6">
                Never see a deadline <br className="hidden sm:inline" />
                <span className="relative inline-block mt-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 font-black">
                    as a surprise again.
                  </span>
                  {/* Underline highlight glow */}
                  <span className="absolute left-0 -bottom-1 w-full h-3.5 bg-indigo-200/40 -z-10 rounded-full blur-[2px]" />
                </span>
              </h1>

              {/* Subtitle with High-Contrast Dark Slate Text */}
              <p className="text-base sm:text-xl text-slate-700 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                Upload course syllabi, assignment prompts, or exam schedules. DeadlineOS AI decomposes them into structured milestones, calculates deterministic priorities, and automatically schedules protected focus blocks.
              </p>

              {/* Dual CTA Group with Radiant Hover Effects */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/demo"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm sm:text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 hover-shimmer transition-all hover:scale-105 active:scale-95 group"
                >
                  <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
                  <span>Launch Interactive Demo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm sm:text-base font-semibold text-slate-800 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-300/90 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Create Free Account</span>
                </Link>
              </div>
            </div>

            {/* Interactive Metrics Cards with Hover Lift */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              {[
                { label: 'On-Time Delivery Rate', val: '99.4%', sub: 'Across 14,000+ course tasks', color: 'text-indigo-600' },
                { label: 'Decomposition Speed', val: '4.2x', sub: 'Faster than manual planning', color: 'text-blue-600' },
                { label: 'Cram Collisions', val: '0', sub: 'Eliminates all-nighter panics', color: 'text-emerald-600' },
                { label: 'Adaptive Rebalancing', val: '100%', sub: 'Deterministic scheduling math', color: 'text-purple-600' },
              ].map((m, i) => (
                <div
                  key={i}
                  className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm interactive-card hover-shimmer cursor-default"
                >
                  <p className={`text-2xl sm:text-3xl font-black ${m.color} tracking-tight`}>{m.val}</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">{m.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: INTERACTIVE HOW IT WORKS PIPELINE — ALL DETAILS VISIBLE UPFRONT */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-100 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200/80">
              Interactive Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
              From Chaotic Syllabus to Calm Execution
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              All 5 stages of the autonomous pipeline are detailed below. Click or hover any step to see live sample transformations.
            </p>
          </div>

          {/* 5 Cards Grid — All Content Visible Upfront */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;
              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer interactive-card ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-400 shadow-lg ring-2 ring-indigo-500/25 scale-[1.02]'
                      : 'bg-slate-50/80 border-slate-200/90 hover:bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-slate-400 font-mono tracking-wider">
                      STAGE {step.num}
                    </span>
                    <div className={`p-2 rounded-xl border ${step.color} shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{step.desc}</p>
                  <div className="pt-3 border-t border-slate-200/70 text-[11px] text-indigo-800 font-semibold leading-normal">
                    {step.detail}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Stage Inspection Preview Box */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                Stage {steps[activeStep].num} Live Transformation
              </span>
              <p className="text-sm sm:text-base font-medium text-slate-200">
                {steps[activeStep].previewExample}
              </p>
            </div>
            <Link
              to="/demo"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-900 bg-white hover:bg-indigo-50 rounded-lg shadow-sm transition-transform hover:scale-105 shrink-0"
            >
              <span>Test This in Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: LIVE SIMULATOR */}
      {/* ========================================================================= */}
      <LiveSimulator />

      {/* ========================================================================= */}
      {/* SECTION: PRIORITY ENGINE & INTERACTIVE PLAYGROUND */}
      {/* ========================================================================= */}
      <section id="priority-engine" className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3.5 py-1 rounded-full border border-purple-200/80">
              Deterministic Math Engine
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
              No Hallucinations. Strict Mathematical Priority.
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Generic LLMs hallucinate timelines when asked to plan arbitrary schedules. DeadlineOS separates responsibilities: AI is used for semantic parsing, while verified math dictates priority.
            </p>
          </div>

          {/* Interactive Priority Slider Playground */}
          <PriorityPlayground />

          {/* Formula Breakdown Matrix — All 4 Metric Weights Visible Upfront */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Urgency Curve', weight: '40% Weight', desc: 'Exponential acceleration as hard deadline nears', color: 'border-l-indigo-600 text-indigo-600' },
              { title: 'Workload Estimate', weight: '25% Weight', desc: 'Total hours needed to fulfill assignment rubric', color: 'border-l-blue-600 text-blue-600' },
              { title: 'Cognitive Difficulty', weight: '15% Weight', desc: 'Weighted by course level, subject, and deliverables', color: 'border-l-amber-600 text-amber-600' },
              { title: 'Conflict Risk', weight: '20% Weight', desc: 'Penalizes overlapping exam weeks & dense schedules', color: 'border-l-rose-600 text-rose-600' },
            ].map((f, idx) => (
              <div
                key={idx}
                className={`bg-slate-50 p-5 rounded-xl border border-slate-200 border-l-4 ${f.color} interactive-card hover-shimmer`}
              >
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{f.weight}</span>
                <h4 className="font-bold text-slate-900 text-sm mt-1 mb-1">{f.title}</h4>
                <p className="text-xs text-slate-600 leading-snug">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: FEATURE SUITE WITH CATEGORY FILTER */}
      {/* ========================================================================= */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200/80">
              Full System Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
              Engineered for Serious Students
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Every feature was designed around how high-performing students study, manage time, and prevent stress.
            </p>
          </div>

          {/* Interactive Feature Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { id: 'all', label: 'All Capabilities' },
              { id: 'scheduling', label: 'Autonomous Scheduling' },
              { id: 'focus', label: 'Focus & Analytics' },
              { id: 'security', label: 'Data & Security' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFeatureCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  featureCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-102'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Feature Grid — All Cards Visible Priorly */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-sm interactive-card hover-shimmer group cursor-default"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-md">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: COMPARISON TABLE WITH HOVER ROWS */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200/80">
              The Paradigm Shift
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
              Passive To-Do Lists vs. DeadlineOS AI
            </h2>
            <p className="text-base text-slate-600">
              Why traditional checklist apps fail when multiple major exams converge at once.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-sm font-bold text-slate-900">Feature Capability</th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-500">Traditional To-Do Apps</th>
                  <th className="py-4 px-6 text-sm font-bold text-indigo-700 bg-indigo-50/70">DeadlineOS AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {[
                  {
                    feature: 'Syllabus & Rubric Ingest',
                    trad: 'Manual typing line by line',
                    dos: 'Automated PDF/Text parsing via GPT-4o with subtasks',
                  },
                  {
                    feature: 'Priority Calculation',
                    trad: 'Subjective tags (High/Med/Low)',
                    dos: 'Deterministic score (Urgency, Workload, Risk, Difficulty)',
                  },
                  {
                    feature: 'Calendar Scheduling',
                    trad: 'None (only displays due dates)',
                    dos: 'Auto-populates max 2-hour focused study blocks',
                  },
                  {
                    feature: 'Handling Missed Days',
                    trad: 'Manual drag-and-drop chaos',
                    dos: 'One-click adaptive mathematical rebalancing',
                  },
                  {
                    feature: 'Burnout Safeguards',
                    trad: 'None (permits 12-hour cram marathons)',
                    dos: 'Strict cognitive load capping & study pacing',
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="py-4 px-6 font-semibold text-slate-800 group-hover:text-indigo-900">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 text-slate-500">{row.trad}</td>
                    <td className="py-4 px-6 text-indigo-900 bg-indigo-50/40 font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{row.dos}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: FAQ ACCORDION — WITH EXPAND ALL / COLLAPSE ALL TOGGLE */}
      {/* ========================================================================= */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200/80">
                Clear Answers
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
                Frequently Asked Questions
              </h2>
            </div>

            {/* Quick Expand/Collapse Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={expandAllFaqs}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-white hover:bg-indigo-50 rounded-lg border border-slate-200 transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={collapseAllFaqs}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaqs.includes(idx);
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left py-5 px-6 flex items-center justify-between text-slate-900 font-semibold text-base hover:text-indigo-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-indigo-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PRE-FOOTER CTA BANNER */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-14 text-center shadow-2xl relative overflow-hidden interactive-card hover-shimmer">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Master Your Term with Autonomous Scheduling
            </h2>
            <p className="text-indigo-200 text-base sm:text-lg">
              Start free today. Experience zero missed deadlines, zero panic, and completely automated study schedules.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-indigo-900 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white border border-white/30 hover:bg-white/10 rounded-xl transition-all hover:scale-105 active:scale-95"
              >
                <span>Explore Interactive Demo</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-sm">
              Deadline<span className="text-indigo-600">OS</span> AI
            </span>
            <span className="text-slate-400">© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          {/* System status pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All AI Autonomous Services Operational</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-slate-800 transition-colors">
              Features
            </a>
            <a href="#priority-engine" className="hover:text-slate-800 transition-colors">
              Priority Engine
            </a>
            <Link to="/demo" className="hover:text-slate-800 transition-colors">
              Live Demo
            </Link>
            <Link to="/login" className="hover:text-slate-800 transition-colors">
              Log In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
