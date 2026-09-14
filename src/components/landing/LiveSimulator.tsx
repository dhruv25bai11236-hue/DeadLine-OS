import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Clock, AlertTriangle, CheckCircle2, ChevronRight, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Scenario {
  id: string;
  title: string;
  course: string;
  deadlineText: string;
  urgency: number;
  workload: number;
  difficulty: number;
  conflictRisk: number;
  hours: number;
  priorityScore: number;
  priorityLevel: 'critical' | 'high' | 'moderate' | 'low';
  subtasks: { title: string; duration: string; completed?: boolean }[];
  scheduleBlocks: { day: string; time: string; focus: string }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'algo-final',
    title: 'CS 161: Dynamic Programming & Graph Theory Final',
    course: 'Computer Science',
    deadlineText: 'In 3 days (Thursday 11:59 PM)',
    urgency: 92,
    workload: 85,
    difficulty: 90,
    conflictRisk: 80,
    hours: 14,
    priorityScore: 87.5,
    priorityLevel: 'critical',
    subtasks: [
      { title: 'Bellman-Ford & Floyd-Warshall proofs', duration: '2.5 hrs' },
      { title: 'DP memoization practice problem set', duration: '3.0 hrs' },
      { title: 'NP-Completeness reduction cheat sheet', duration: '2.0 hrs' },
      { title: 'Timed practice exam & review', duration: '4.0 hrs' },
    ],
    scheduleBlocks: [
      { day: 'Today', time: '4:00 PM – 6:00 PM', focus: 'Block 1: Shortest path algorithms' },
      { day: 'Tomorrow', time: '10:00 AM – 12:00 PM', focus: 'Block 2: DP State transitions' },
      { day: 'Tomorrow', time: '2:30 PM – 4:30 PM', focus: 'Block 3: Reductions review' },
      { day: 'Wed', time: '6:00 PM – 8:00 PM', focus: 'Block 4: Mock exam simulation' },
    ],
  },
  {
    id: 'macro-essay',
    title: 'ECON 202: Monetary Policy & Inflation Research Paper',
    course: 'Macroeconomics',
    deadlineText: 'In 6 days (Sunday 5:00 PM)',
    urgency: 65,
    workload: 70,
    difficulty: 60,
    conflictRisk: 40,
    hours: 8,
    priorityScore: 60.5,
    priorityLevel: 'moderate',
    subtasks: [
      { title: 'Aggregate St. Louis Fed FRED time-series data', duration: '1.5 hrs' },
      { title: 'Draft literature review on quantitative easing', duration: '2.5 hrs' },
      { title: 'Empirical regression analysis in R / Stata', duration: '2.0 hrs' },
      { title: 'Conclusion, citations & executive summary', duration: '1.5 hrs' },
    ],
    scheduleBlocks: [
      { day: 'Tomorrow', time: '7:00 PM – 9:00 PM', focus: 'Block 1: FRED data ingestion' },
      { day: 'Thursday', time: '3:00 PM – 5:00 PM', focus: 'Block 2: Drafting methodology' },
      { day: 'Saturday', time: '11:00 AM – 1:00 PM', focus: 'Block 3: Empirical conclusions' },
    ],
  },
  {
    id: 'bio-lab',
    title: 'BIO 105: CRISPR Cas9 Gene Editing Lab Report',
    course: 'Molecular Biology',
    deadlineText: 'In 24 hours (Tomorrow 9:00 AM)',
    urgency: 98,
    workload: 60,
    difficulty: 75,
    conflictRisk: 95,
    hours: 6,
    priorityScore: 84.5,
    priorityLevel: 'critical',
    subtasks: [
      { title: 'Analyze electrophoresis gel imaging data', duration: '1.5 hrs' },
      { title: 'Document bacterial transformation efficiency', duration: '1.5 hrs' },
      { title: 'Discussion of off-target cleavage mutations', duration: '2.0 hrs' },
    ],
    scheduleBlocks: [
      { day: 'Today', time: '2:00 PM – 4:00 PM', focus: 'Block 1: Gel imaging & quantification' },
      { day: 'Today', time: '7:30 PM – 9:30 PM', focus: 'Block 2: Discussion & final graphs' },
    ],
  },
];

export const LiveSimulator = () => {
  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);

  const getBadgeStyle = (level: Scenario['priorityLevel']) => {
    switch (level) {
      case 'critical':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'high':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'moderate':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    }
  };

  return (
    <section id="simulator" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            See the Autonomous Planner in Action
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Select a real-world scenario below to watch how DeadlineOS parses syllabi, weighs urgency against complexity, and auto-schedules protected focus blocks.
          </p>
        </div>

        {/* Scenario Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveScenario(s)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeScenario.id === s.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-102'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{s.title.split(':')[0]}</span>
            </button>
          ))}
        </div>

        {/* Simulator Interactive Dashboard Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
          {/* Header Bar */}
          <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                {activeScenario.course}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {activeScenario.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {activeScenario.deadlineText}
              </span>
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getBadgeStyle(
                  activeScenario.priorityLevel
                )}`}
              >
                {activeScenario.priorityLevel} Priority ({activeScenario.priorityScore.toFixed(0)}/100)
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid lg:grid-cols-12 gap-8">
            {/* Left: Deterministic Metrics (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Autonomous Scoring Matrix
                </h4>
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                  {/* Urgency */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>Urgency Weight (40%)</span>
                      <span className="font-bold text-slate-900">{activeScenario.urgency}/100</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-indigo-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeScenario.urgency}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>

                  {/* Workload */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>Workload Estimate (25%)</span>
                      <span className="font-bold text-slate-900">{activeScenario.workload}/100</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeScenario.workload}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>Cognitive Difficulty (15%)</span>
                      <span className="font-bold text-slate-900">{activeScenario.difficulty}/100</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-amber-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeScenario.difficulty}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>

                  {/* Conflict Risk */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>Calendar Conflict Risk (20%)</span>
                      <span className="font-bold text-slate-900">{activeScenario.conflictRisk}/100</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-rose-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeScenario.conflictRisk}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Calculated Hours */}
              <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-indigo-700 font-medium">Estimated AI Workload</span>
                  <p className="text-xl font-bold text-indigo-900">{activeScenario.hours} Focused Hours</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                  Σ
                </div>
              </div>
            </div>

            {/* Middle: AI Subtask Decomposition (4 Cols) */}
            <div className="lg:col-span-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Subtask Decomposition</span>
              </h4>
              <div className="space-y-2.5">
                {activeScenario.subtasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors shadow-sm flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-slate-900 leading-snug">
                        {task.title}
                      </p>
                      <span className="text-[11px] text-slate-500 font-medium">{task.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Scheduled Timeline Blocks (3 Cols) */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Auto-Scheduled Blocks</span>
              </h4>
              <div className="space-y-2.5">
                {activeScenario.scheduleBlocks.map((block, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 hover:bg-indigo-50/50 hover:border-indigo-200 transition-colors"
                  >
                    <div className="flex items-center justify-between text-indigo-700 font-bold">
                      <span>{block.day}</span>
                      <span className="text-[11px] font-medium text-slate-500">{block.time}</span>
                    </div>
                    <p className="text-slate-800 font-medium line-clamp-1">{block.focus}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  to="/demo"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all"
                >
                  <span>Open in Full Sandbox</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
