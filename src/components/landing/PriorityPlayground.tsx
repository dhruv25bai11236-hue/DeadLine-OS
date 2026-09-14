import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sliders, AlertCircle, Sparkles, RefreshCw, Zap } from 'lucide-react';

export const PriorityPlayground = () => {
  const [urgency, setUrgency] = useState(85);
  const [workload, setWorkload] = useState(70);
  const [difficulty, setDifficulty] = useState(80);
  const [conflictRisk, setConflictRisk] = useState(65);

  // Deterministic formula: Priority = Urgency*0.40 + Workload*0.25 + Difficulty*0.15 + Risk*0.20
  const priorityScore =
    urgency * 0.4 + workload * 0.25 + difficulty * 0.15 + conflictRisk * 0.2;

  const getPriorityLevel = (score: number) => {
    if (score >= 80) return { label: 'CRITICAL', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    if (score >= 60) return { label: 'HIGH', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (score >= 40) return { label: 'MODERATE', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    return { label: 'LOW', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  };

  const level = getPriorityLevel(priorityScore);

  const applyPreset = (preset: 'finals' | 'steady' | 'crunch') => {
    if (preset === 'finals') {
      setUrgency(95);
      setWorkload(90);
      setDifficulty(85);
      setConflictRisk(90);
    } else if (preset === 'steady') {
      setUrgency(40);
      setWorkload(50);
      setDifficulty(45);
      setConflictRisk(25);
    } else {
      setUrgency(80);
      setWorkload(45);
      setDifficulty(60);
      setConflictRisk(50);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8 relative overflow-hidden interactive-card">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base sm:text-lg">Live Heuristic Sandbox</h4>
            <p className="text-xs text-slate-500">Drag sliders to test deterministic scoring response</p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">Presets:</span>
          <button
            onClick={() => applyPreset('finals')}
            className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-all hover:scale-105"
          >
            Finals Week
          </button>
          <button
            onClick={() => applyPreset('crunch')}
            className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-all hover:scale-105"
          >
            Midterm Rush
          </button>
          <button
            onClick={() => applyPreset('steady')}
            className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all hover:scale-105"
          >
            Regular Week
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-center">
        {/* Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Urgency */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                Urgency (40% Weight)
              </span>
              <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {urgency}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={urgency}
              onChange={(e) => setUrgency(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Workload */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Workload Estimate (25% Weight)
              </span>
              <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {workload}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={workload}
              onChange={(e) => setWorkload(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Difficulty */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Cognitive Difficulty (15% Weight)
              </span>
              <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                {difficulty}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Conflict Risk */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Calendar Conflict Risk (20% Weight)
              </span>
              <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                {conflictRisk}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={conflictRisk}
              onChange={(e) => setConflictRisk(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>
        </div>

        {/* Calculated Result Badge & Gauge (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-indigo-50/30 p-6 rounded-2xl border border-indigo-100/80 text-center flex flex-col items-center justify-center space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Computed Priority Output
          </span>

          <motion.div
            key={priorityScore}
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight"
          >
            {priorityScore.toFixed(1)}
            <span className="text-xl text-slate-400 font-normal">/100</span>
          </motion.div>

          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${level.color}`}
          >
            {level.label} PRIORITY
          </span>

          <p className="text-xs text-slate-500 max-w-xs mt-2">
            {priorityScore >= 80
              ? 'Triggers urgent scheduling override. Maximum 2-hour daily study locks assigned immediately.'
              : priorityScore >= 60
              ? 'Scheduled across mid-week available windows with active reminder nudges.'
              : 'Distributed comfortably across open weekend slots with low stress index.'}
          </p>
        </div>
      </div>
    </div>
  );
};
