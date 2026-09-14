import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Clock, CheckCircle2, Circle, Sparkles, Calendar, ChevronDown, ArrowRight, Sliders, Plus, Trash2 } from 'lucide-react';
import { useTasks, Task, SubtaskItem } from '@/hooks/useTasks';
import { Link } from 'react-router-dom';

// Compute realistic, customized study hours based on assignment title, due date, page count, and priority
function computeAssignmentStudyHours(task: Task): number {
  if (task.estimatedHours && task.estimatedHours > 0) {
    return task.estimatedHours;
  }

  // 1. Calculate time delta until due date
  const msUntilDue = new Date(task.deadline).getTime() - Date.now();
  const daysUntilDue = Math.max(0.5, msUntilDue / (1000 * 60 * 60 * 24));

  // 2. Keyword & Scope detection from Title
  const title = (task.title || '').toLowerCase();
  let baseHours = 6.5;

  if (/final|capstone|thesis|midterm/i.test(title)) {
    baseHours = 14.5;
  } else if (/project|research|prototype|presentation/i.test(title)) {
    baseHours = 11.5;
  } else if (/lab|experiment|report|essay|paper/i.test(title)) {
    baseHours = 8.0;
  } else if (/problem set|pset|homework|problem/i.test(title)) {
    baseHours = 5.5;
  } else if (/quiz|reading|discussion|reflection|prep/i.test(title)) {
    baseHours = 3.0;
  } else {
    baseHours = task.priority === 'High' ? 10.0 : task.priority === 'Medium' ? 6.5 : 3.5;
  }

  // 3. Length & page volume scaling
  if (task.pageCount && task.pageCount > 1) {
    baseHours = Math.max(baseHours, Math.min(22, task.pageCount * 2.5));
  }

  // 4. Due date scaling: larger lead times accommodate larger scope
  if (daysUntilDue > 10 && baseHours >= 8) {
    baseHours += 2.5;
  } else if (daysUntilDue <= 1 && baseHours > 6) {
    baseHours = Math.min(baseHours, 5.0);
  }

  // 5. Unique deterministic variance so distinct assignments don't share identical hours
  let charSum = 0;
  for (let i = 0; i < task.title.length; i++) {
    charSum += task.title.charCodeAt(i);
  }
  const variance = ((charSum % 5) - 2) * 0.5; // -1.0, -0.5, 0, +0.5, +1.0

  return Math.max(2.5, Math.round((baseHours + variance) * 2) / 2);
}

export function AssignmentMatrixSection() {
  const { tasks, updateTask } = useTasks();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  // Active assignment
  const activeTask = useMemo(() => {
    if (selectedId) {
      const found = tasks.find(t => t.id === selectedId);
      if (found) return found;
    }
    const uncompleted = tasks.filter(t => t.status !== 'Completed');
    return uncompleted.find(t => t.priority === 'High') || uncompleted[0] || tasks[0] || null;
  }, [tasks, selectedId]);

  // 1. SUBTASKS UNIQUE TO THIS ASSIGNMENT AND ITS CALCULATED HOURS
  const subtasksList: SubtaskItem[] = useMemo(() => {
    if (!activeTask) return [];
    if (activeTask.subtasks && activeTask.subtasks.length > 0) {
      return activeTask.subtasks;
    }

    const title = activeTask.title;
    const course = activeTask.course || 'Course';
    const computedHours = computeAssignmentStudyHours(activeTask);

    const h1 = Math.max(1, Math.round(computedHours * 0.25 * 2) / 2);
    const h2 = Math.max(1.5, Math.round(computedHours * 0.35 * 2) / 2);
    const h3 = Math.max(1, Math.round(computedHours * 0.25 * 2) / 2);
    const h4 = Math.max(1, Math.round((computedHours - (h1 + h2 + h3)) * 2) / 2);

    return [
      { id: 'st-1', title: `Review ${title} requirements & rubric for ${course}`, durationHours: h1, completed: false },
      { id: 'st-2', title: `Core problem solving & drafting for ${title}`, durationHours: h2, completed: false },
      { id: 'st-3', title: `Implementation verification & methodology check`, durationHours: h3, completed: false },
      { id: 'st-4', title: `Final documentation, citations & submission review`, durationHours: h4, completed: false },
    ];
  }, [activeTask]);

  // 2. DYNAMIC ESTIMATED STUDY HOURS & COUNTDOWN
  const totalStudyHours = useMemo(() => {
    if (!activeTask) return 6;
    if (subtasksList.length > 0) {
      const sum = subtasksList.reduce((acc, st) => acc + (Number(st.durationHours) || 0), 0);
      return Math.round(sum * 10) / 10;
    }
    return computeAssignmentStudyHours(activeTask);
  }, [subtasksList, activeTask]);

  const remainingStudyHours = useMemo(() => {
    const uncompleted = subtasksList.filter(s => !s.completed);
    if (!uncompleted.length) return 0;
    const sum = uncompleted.reduce((acc, st) => acc + (Number(st.durationHours) || 0), 0);
    return Math.round(sum * 10) / 10;
  }, [subtasksList]);

  // Edit form state
  const [editUrgency, setEditUrgency] = useState(65);
  const [editWorkload, setEditWorkload] = useState(70);
  const [editDifficulty, setEditDifficulty] = useState(60);
  const [editConflict, setEditConflict] = useState(45);
  const [editHours, setEditHours] = useState(8);
  const [editSubtasks, setEditSubtasks] = useState<SubtaskItem[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskHours, setNewSubtaskHours] = useState(2.0);

  const handleOpenEdit = () => {
    if (!activeTask) return;
    setEditUrgency(computedMetrics.urgency);
    setEditWorkload(computedMetrics.workload);
    setEditDifficulty(computedMetrics.difficulty);
    setEditConflict(computedMetrics.conflict);
    setEditHours(totalStudyHours);
    setEditSubtasks(subtasksList);
    setEditOpen(true);
  };

  const handleSaveCustomization = () => {
    if (!activeTask) return;
    const newTotalHours = editSubtasks.reduce((a, b) => a + (Number(b.durationHours) || 0), 0) || editHours;
    updateTask({
      ...activeTask,
      estimatedHours: Math.round(newTotalHours * 10) / 10,
      subtasks: editSubtasks,
      metrics: {
        urgency: editUrgency,
        workload: editWorkload,
        difficulty: editDifficulty,
        conflictRisk: editConflict,
      },
    });
    setEditOpen(false);
  };

  // 3. DYNAMIC SCORING FROM ACTUAL DEADLINE & STUDY HOURS
  const computedMetrics = useMemo(() => {
    if (!activeTask) return { urgency: 65, workload: 70, difficulty: 60, conflict: 45, score: 62 };

    if (activeTask.metrics?.urgency !== undefined) {
      const u = activeTask.metrics.urgency ?? 65;
      const w = activeTask.metrics.workload ?? 70;
      const d = activeTask.metrics.difficulty ?? 60;
      const c = activeTask.metrics.conflictRisk ?? 45;
      const score = Math.round((u * 0.40) + (w * 0.25) + (d * 0.15) + (c * 0.20));
      return { urgency: u, workload: w, difficulty: d, conflict: c, score };
    }

    // A. Urgency: strictly calculated from remaining time
    const msLeft = new Date(activeTask.deadline).getTime() - Date.now();
    const daysLeft = Math.max(0.1, msLeft / (1000 * 60 * 60 * 24));
    let urgency = 95;
    if (daysLeft > 14) urgency = Math.max(15, Math.round(35 - daysLeft));
    else if (daysLeft > 7) urgency = Math.round(40 + (14 - daysLeft) * 3);
    else if (daysLeft > 3) urgency = Math.round(62 + (7 - daysLeft) * 5);
    else if (daysLeft > 1) urgency = Math.round(80 + (3 - daysLeft) * 7);
    else urgency = Math.min(99, Math.round(94 + (1 - daysLeft) * 5));

    // B. Workload: dynamically tied to this assignment's study hours
    const workload = Math.min(96, Math.max(20, Math.round((remainingStudyHours / 16) * 85)));

    // C. Cognitive Difficulty
    const difficulty = activeTask.priority === 'High' ? 88 : activeTask.priority === 'Medium' ? 62 : 38;

    // D. Calendar Conflict Risk
    const overlapping = tasks.filter(t => t.id !== activeTask.id && Math.abs(new Date(t.deadline).getTime() - new Date(activeTask.deadline).getTime()) <= 72 * 60 * 60 * 1000).length;
    const conflict = Math.min(95, Math.max(20, 25 + overlapping * 25));

    const score = Math.round((urgency * 0.40) + (workload * 0.25) + (difficulty * 0.15) + (conflict * 0.20));

    return { urgency, workload, difficulty, conflict, score };
  }, [activeTask, tasks, remainingStudyHours]);

  const toggleSubtask = (stId: string) => {
    if (!activeTask) return;
    const updated = subtasksList.map(st => st.id === stId ? { ...st, completed: !st.completed } : st);
    const completedCount = updated.filter(s => s.completed).length;
    const newProgress = Math.round((completedCount / updated.length) * 100);
    updateTask({
      ...activeTask,
      subtasks: updated,
      progress: newProgress,
      status: newProgress === 100 ? 'Completed' : newProgress > 0 ? 'In Progress' : 'Not Started',
    });
  };

  // 4. AUTO-SCHEDULED BLOCKS ADAPTED TO THIS ASSIGNMENT'S HOURS
  const scheduledBlocks = useMemo(() => {
    if (!activeTask) return [];
    const hoursToSchedule = remainingStudyHours > 0 ? remainingStudyHours : totalStudyHours;
    const blockCount = Math.min(4, Math.max(1, Math.ceil(hoursToSchedule / 2)));
    const deadline = new Date(activeTask.deadline);
    const now = new Date();
    const spanMs = Math.max(1000 * 60 * 60 * 24, deadline.getTime() - now.getTime());
    const stepMs = spanMs / (blockCount + 1);

    const blocks = [];
    const timeSlots = ['4:00 PM – 6:00 PM', '10:00 AM – 12:00 PM', '2:30 PM – 4:30 PM', '6:00 PM – 8:00 PM'];
    const activeSubtasks = subtasksList.filter(s => !s.completed);

    for (let i = 0; i < blockCount; i++) {
      const blockTime = new Date(now.getTime() + stepMs * (i + 0.6));
      const diffDays = Math.round((blockTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      let dayLabel = diffDays <= 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : blockTime.toLocaleDateString(undefined, { weekday: 'short' });
      const focusTitle = activeSubtasks[i]?.title || subtasksList[i]?.title || `${activeTask.title} Part ${i + 1}`;

      blocks.push({
        day: dayLabel,
        time: timeSlots[i % timeSlots.length],
        focus: `Block ${i + 1}: ${focusTitle}`,
      });
    }

    return blocks;
  }, [activeTask, remainingStudyHours, totalStudyHours, subtasksList]);

  if (!activeTask) {
    return (
      <Card className="border-slate-200/90 shadow-sm p-8 text-center bg-gradient-to-b from-white to-slate-50">
        <Sparkles className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-slate-800">Autonomous Scoring & AI Breakdown</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
          Add an assignment to inspect its autonomous scoring matrix, tailored subtasks, and study hours.
        </p>
        <Link to="/assignments" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm">
          <span>+ Add Assignment</span>
        </Link>
      </Card>
    );
  }

  const deadlineDate = new Date(activeTask.deadline);
  const diffDays = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const deadlineText = diffDays <= 0 
    ? 'Due today' 
    : diffDays === 1 
    ? 'Tomorrow' 
    : `In ${diffDays} days (${deadlineDate.toLocaleDateString(undefined, { weekday: 'long', hour: '2-digit', minute: '2-digit' })})`;

  const percentDone = totalStudyHours > 0 ? Math.round(((totalStudyHours - remainingStudyHours) / totalStudyHours) * 100) : 0;

  return (
    <Card className="border-slate-200/90 shadow-sm bg-white overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              {activeTask.course || 'GENERAL'}
            </span>
            {tasks.length > 1 && (
              <div className="relative inline-block">
                <select
                  value={activeTask.id}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-1 px-2.5 rounded-lg border-0 cursor-pointer appearance-none pr-6"
                >
                  {tasks.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-500 absolute right-1.5 top-2 pointer-events-none" />
              </div>
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            {activeTask.title}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={handleOpenEdit}
            className="text-xs flex items-center gap-1.5 h-8 border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Customize Matrix & Subtasks</span>
          </Button>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{deadlineText}</span>
          </div>

          <Badge className={`text-xs px-3 py-1 font-bold ${
            computedMetrics.score >= 80 
              ? 'bg-rose-100 text-rose-700 border-rose-200' 
              : computedMetrics.score >= 50
              ? 'bg-amber-100 text-amber-700 border-amber-200'
              : 'bg-emerald-100 text-emerald-700 border-emerald-200'
          }`}>
            {computedMetrics.score >= 80 ? 'CRITICAL PRIORITY' : computedMetrics.score >= 50 ? 'MODERATE PRIORITY' : 'LOW PRIORITY'} ({computedMetrics.score}/100)
          </Badge>
        </div>
      </div>

      {/* 3-Column Content Layout */}
      <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Autonomous Scoring Matrix */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Autonomous Scoring Matrix</span>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Urgency Weight (40%)</span>
                <span className="text-slate-900">{computedMetrics.urgency}/100</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${computedMetrics.urgency}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Workload Estimate (25%)</span>
                <span className="text-slate-900">{computedMetrics.workload}/100</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${computedMetrics.workload}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Cognitive Difficulty (15%)</span>
                <span className="text-slate-900">{computedMetrics.difficulty}/100</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${computedMetrics.difficulty}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Calendar Conflict Risk (20%)</span>
                <span className="text-slate-900">{computedMetrics.conflict}/100</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${computedMetrics.conflict}%` }} />
              </div>
            </div>
          </div>

          {/* DYNAMIC ESTIMATED STUDY HOURS BOX */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between mt-6">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-indigo-700">Estimated Study Workload</p>
                {percentDone > 0 && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                    {percentDone}% completed
                  </span>
                )}
              </div>
              <p className="text-xl font-black text-slate-900 mt-0.5">
                {remainingStudyHours} <span className="text-xs font-semibold text-slate-500">/ {totalStudyHours} Focused Hours</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {remainingStudyHours === 0 ? 'All subtask hours completed!' : `${remainingStudyHours} hrs remaining across ${subtasksList.filter(s => !s.completed).length} subtasks`}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              Σ
            </div>
          </div>
        </div>

        {/* Column 2: AI Subtask Decomposition */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Subtask Decomposition</span>
            </div>
            <span className="text-[11px] text-slate-400">Click to complete</span>
          </div>

          <div className="space-y-2.5">
            {subtasksList.map((subtask) => (
              <div 
                key={subtask.id}
                onClick={() => toggleSubtask(subtask.id)}
                className={`p-3 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
                  subtask.completed 
                    ? 'bg-emerald-50/50 border-emerald-200' 
                    : 'bg-white border-slate-200/80 hover:border-indigo-300'
                }`}
              >
                {subtask.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 hover:text-indigo-600 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-semibold leading-tight truncate ${
                    subtask.completed ? 'text-emerald-900 line-through' : 'text-slate-800'
                  }`}>
                    {subtask.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{subtask.durationHours} hrs</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Auto-Scheduled Blocks */}
        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Auto-Scheduled Blocks</span>
            </div>

            <div className="space-y-2.5">
              {scheduledBlocks.map((block, index) => (
                <div key={index} className="p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-900">{block.day}</span>
                    <span className="text-slate-500 text-[11px]">{block.time}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 truncate">{block.focus}</p>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/timeline"
            className="w-full mt-3 h-10 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>Open in Full Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </CardContent>

      {/* Manual Customization Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg p-6 space-y-5 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              Customize Scoring Matrix & Subtasks
            </DialogTitle>
          </DialogHeader>

          {/* Matrix Sliders */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Adjust Scoring Weights</h4>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Urgency Weight (40%)</span>
                <span className="text-indigo-600">{editUrgency}/100</span>
              </div>
              <input type="range" min="0" max="100" value={editUrgency} onChange={e => setEditUrgency(Number(e.target.value))} className="w-full accent-indigo-600" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Workload Estimate (25%)</span>
                <span className="text-blue-600">{editWorkload}/100</span>
              </div>
              <input type="range" min="0" max="100" value={editWorkload} onChange={e => setEditWorkload(Number(e.target.value))} className="w-full accent-blue-600" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Cognitive Difficulty (15%)</span>
                <span className="text-amber-600">{editDifficulty}/100</span>
              </div>
              <input type="range" min="0" max="100" value={editDifficulty} onChange={e => setEditDifficulty(Number(e.target.value))} className="w-full accent-amber-600" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Calendar Conflict Risk (20%)</span>
                <span className="text-rose-600">{editConflict}/100</span>
              </div>
              <input type="range" min="0" max="100" value={editConflict} onChange={e => setEditConflict(Number(e.target.value))} className="w-full accent-rose-600" />
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-bold text-slate-700">Total Workload Hours</Label>
                <span className="text-xs font-bold text-indigo-600">
                  Sum of subtasks: {editSubtasks.reduce((a, b) => a + (Number(b.durationHours) || 0), 0)} hrs
                </span>
              </div>
              <Input 
                type="number" 
                step="0.5"
                min="1" 
                max="60" 
                value={editHours} 
                onChange={e => setEditHours(Number(e.target.value))} 
                className="mt-1 bg-white" 
              />
            </div>
          </div>

          {/* Subtasks Editor */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Manage Subtasks</h4>
              <span className="text-xs text-slate-400">Duration (hrs)</span>
            </div>
            
            <div className="space-y-2">
              {editSubtasks.map((st, index) => (
                <div key={st.id || index} className="flex items-center gap-2">
                  <Input 
                    value={st.title} 
                    onChange={e => {
                      const updated = [...editSubtasks];
                      updated[index].title = e.target.value;
                      setEditSubtasks(updated);
                    }}
                    className="text-xs h-8 flex-1"
                  />
                  <Input 
                    type="number" 
                    step="0.5" 
                    value={st.durationHours} 
                    onChange={e => {
                      const updated = [...editSubtasks];
                      updated[index].durationHours = Number(e.target.value);
                      setEditSubtasks(updated);
                      const sum = updated.reduce((a, b) => a + (Number(b.durationHours) || 0), 0);
                      setEditHours(Math.round(sum * 10) / 10);
                    }}
                    className="w-20 text-xs h-8"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                    onClick={() => {
                      const updated = editSubtasks.filter((_, i) => i !== index);
                      setEditSubtasks(updated);
                      const sum = updated.reduce((a, b) => a + (Number(b.durationHours) || 0), 0);
                      setEditHours(Math.round(sum * 10) / 10);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Subtask */}
            <div className="flex items-center gap-2 pt-1">
              <Input 
                placeholder="New subtask title..." 
                value={newSubtaskTitle}
                onChange={e => setNewSubtaskTitle(e.target.value)}
                className="text-xs h-8 flex-1"
              />
              <Input 
                type="number" 
                step="0.5" 
                value={newSubtaskHours}
                onChange={e => setNewSubtaskHours(Number(e.target.value))}
                className="w-20 text-xs h-8"
              />
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs flex items-center gap-1"
                onClick={() => {
                  if (newSubtaskTitle.trim()) {
                    const updated = [
                      ...editSubtasks,
                      { id: `st-${Date.now()}`, title: newSubtaskTitle.trim(), durationHours: newSubtaskHours, completed: false },
                    ];
                    setEditSubtasks(updated);
                    const sum = updated.reduce((a, b) => a + (Number(b.durationHours) || 0), 0);
                    setEditHours(Math.round(sum * 10) / 10);
                    setNewSubtaskTitle('');
                  }
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </Button>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCustomization} className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}