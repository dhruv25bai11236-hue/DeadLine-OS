import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DemoProvider, useDemo } from '@/hooks/useDemo';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FocusTimer from '@/components/focus/FocusTimer';
import { exportTimelineToPdf } from '@/utils/exportPdf';
import { exportToCsv } from '@/utils/exportCsv';
import {
  Sparkles,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Download,
  Plus,
  Zap,
  BarChart3,
  Layers,
  FileDown,
} from 'lucide-react';

const DemoContent = () => {
  const { isDemo, assignments, schedule } = useDemo();
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'focus'>('overview');
  const [replanning, setReplanning] = useState(false);
  const [replanSuccess, setReplanSuccess] = useState(false);
  const [localAssignments, setLocalAssignments] = useState(assignments);

  const handleReplan = () => {
    setReplanning(true);
    setTimeout(() => {
      setReplanning(false);
      setReplanSuccess(true);
      setTimeout(() => setReplanSuccess(false), 3500);
    }, 1200);
  };

  const handleAddSample = () => {
    const newItem = {
      id: String(Date.now()),
      title: 'PHYS 210: Quantum Harmonic Oscillator Problem Set',
      course: 'Physics',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      priority: 'high',
      status: 'pending',
    };
    setLocalAssignments([newItem, ...localAssignments]);
  };

  const handleExportPdf = () => {
    exportTimelineToPdf(localAssignments as any, schedule as any);
  };

  const handleExportCsv = () => {
    exportToCsv(localAssignments, 'deadlineos-assignments.csv');
  };

  return (
    <div className="relative min-h-screen bg-slate-50/60 text-slate-900 pb-20">
      {/* Floating Demo Badge */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <Badge className="px-3.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center gap-1.5 border-emerald-500">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>Interactive Sandbox Mode</span>
        </Badge>
        <Link
          to="/signup"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-md transition-all"
        >
          <span>Save Progress & Sign Up</span>
        </Link>
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Landing</span>
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-sm">
              Deadline<span className="text-indigo-600">OS</span> AI Demo
            </span>
          </div>
        </div>

        {/* Global Demo Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportPdf}
            className="text-xs flex items-center gap-1.5 border-slate-200 hover:border-slate-300"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCsv}
            className="text-xs flex items-center gap-1.5 border-slate-200 hover:border-slate-300"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>

          <Button
            size="sm"
            onClick={handleReplan}
            disabled={replanning}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${replanning ? 'animate-spin' : ''}`} />
            <span>{replanning ? 'Calculating...' : 'Replan Schedule'}</span>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Replan Notification Banner */}
        {replanSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Autonomous Rebalancing Complete: Schedule reorganized without collisions. Downstream blocks smoothed over open slots.
            </span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Mission Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'timeline'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Study Timeline</span>
            </button>

            <button
              onClick={() => setActiveTab('focus')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'focus'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Focus Timer</span>
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleAddSample}
            className="text-xs flex items-center gap-1.5 border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Coursework</span>
          </Button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="border-slate-200 interactive-card">
                <CardContent className="pt-6">
                  <div className="text-xs font-bold text-slate-500 uppercase">Active Deadlines</div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    {localAssignments.length}
                  </div>
                  <div className="text-xs text-indigo-600 font-medium mt-1">2 due this week</div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 interactive-card">
                <CardContent className="pt-6">
                  <div className="text-xs font-bold text-slate-500 uppercase">Planned Hours</div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">18.5 hrs</div>
                  <div className="text-xs text-slate-500 font-medium mt-1">Across 9 study blocks</div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 interactive-card">
                <CardContent className="pt-6">
                  <div className="text-xs font-bold text-slate-500 uppercase">Priority Index</div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">87.4</div>
                  <div className="text-xs text-amber-700 font-medium mt-1">Elevated exam congestion</div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 interactive-card">
                <CardContent className="pt-6">
                  <div className="text-xs font-bold text-slate-500 uppercase">On-Time Projection</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">100%</div>
                  <div className="text-xs text-emerald-700 font-medium mt-1">Safe execution margin</div>
                </CardContent>
              </Card>
            </div>

            {/* Assignments & Schedule Grid */}
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Left: Active Coursework */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Active Academic Deliverables</span>
                  </h3>
                  <span className="text-xs text-slate-500">Sorted by Deterministic Priority</span>
                </div>

                <div className="space-y-3">
                  {localAssignments.map((a) => (
                    <div
                      key={a.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 interactive-card"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            {a.course}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                            {a.priority || 'High'} Priority
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-1.5">{a.title}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setLocalAssignments(localAssignments.filter((item) => item.id !== a.id));
                          }}
                          className="text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          Dismiss
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs bg-slate-900 hover:bg-indigo-600 text-white"
                          onClick={() => setActiveTab('focus')}
                        >
                          Start Focus
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Scheduled Study Blocks */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Auto-Scheduled Study Blocks</span>
                  </h3>
                  <span className="text-xs text-slate-500">Max 2h chunks</span>
                </div>

                <div className="space-y-3">
                  {schedule.map((s) => (
                    <div
                      key={s.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all space-y-1.5 interactive-card"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                          {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-slate-400 text-[11px] font-medium">Scheduled Focus</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{s.title}</h4>
                      <p className="text-xs text-slate-500">Auto-allocated within peak focus window</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Timeline View */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Autonomous Weekly Schedule</CardTitle>
                <CardDescription>
                  Study blocks automatically positioned between your classes, meals, and rest hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  {['Monday', 'Wednesday', 'Friday'].map((day, i) => (
                    <div key={day} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between font-bold text-sm text-slate-900 pb-2 border-b border-slate-200">
                        <span>{day}</span>
                        <Badge variant="outline" className="text-[10px] text-indigo-700 bg-indigo-50 border-indigo-200">
                          2 Blocks Planned
                        </Badge>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs text-xs space-y-1">
                        <span className="font-bold text-indigo-600">10:00 AM – 12:00 PM</span>
                        <p className="font-medium text-slate-800">
                          {i === 0 ? 'Calculus: Derivatives Proofs' : i === 1 ? 'React: Architecture & Context' : 'Physics: State Vectors'}
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs text-xs space-y-1">
                        <span className="font-bold text-blue-600">3:30 PM – 5:00 PM</span>
                        <p className="font-medium text-slate-800">
                          {i === 0 ? 'Macroeconomics: Dataset Review' : i === 1 ? 'Algorithm: Graph Traversal' : 'Final Submission Review'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 3: Deep Focus Mode */}
        {activeTab === 'focus' && (
          <div className="max-w-2xl mx-auto py-4">
            <FocusTimer />
          </div>
        )}
      </main>
    </div>
  );
};

export default function DemoPage() {
  return (
    <DemoProvider>
      <DemoContent />
    </DemoProvider>
  );
}
