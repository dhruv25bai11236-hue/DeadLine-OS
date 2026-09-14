import { useState } from 'react';
import { CalendarDays, List, Orbit, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import CalendarView from '@/components/timeline/CalendarView';
import ListView from '@/components/timeline/ListView';
import { useTasks } from '@/hooks/useTasks';

const colors = ['from-indigo-500 to-violet-600', 'from-cyan-500 to-blue-600', 'from-amber-400 to-orange-500', 'from-rose-500 to-pink-600'];

function ThreeDView() {
  const { tasks } = useTasks();
  return (
    <div className="relative min-h-[540px] overflow-hidden rounded-2xl border bg-slate-950 p-6 text-white shadow-xl">
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #4f46e5 0, transparent 26%), radial-gradient(circle at 80% 75%, #0891b2 0, transparent 30%)' }} />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-indigo-200">Interactive planning space</p>
          <h2 className="mt-2 text-2xl font-bold">Your deadline universe</h2>
          <p className="mt-1 text-sm text-slate-300">Hover a task orbit to explore its schedule.</p>
        </div>
        <Orbit className="h-10 w-10 text-indigo-300" />
      </div>
      <div className="relative mx-auto mt-10 flex min-h-[360px] max-w-4xl items-center justify-center">
        <div className="absolute h-28 w-28 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-orange-600 shadow-[0_0_75px_20px_rgba(251,191,36,.4)]" />
        {[0, 1, 2].map(r => (
          <div key={r} className="absolute rounded-full border border-white/15" style={{ width: `${260 + r * 155}px`, height: `${130 + r * 85}px`, transform: 'rotate(-18deg)' }} />
        ))}
        {tasks.map((task, index) => {
          const angle = (index / Math.max(tasks.length, 1)) * Math.PI * 2 - 0.65;
          const radius = 145 + (index % 3) * 72;
          return (
            <div key={task.id} className="absolute group" style={{ transform: `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius * 0.48}px)` }}>
              <div className={`h-5 w-5 rounded-full bg-gradient-to-r ${colors[index % colors.length]} ring-8 ring-white/10 shadow-lg transition-transform duration-300 group-hover:scale-150`} />
              <div className="absolute left-5 top-4 w-48 rounded-xl border border-white/15 bg-slate-900/90 p-3 opacity-80 shadow-xl backdrop-blur transition-all group-hover:scale-105 group-hover:opacity-100">
                <p className="truncate text-sm font-semibold">{task.title}</p>
                <p className="mt-1 text-xs text-slate-300">{new Date(task.deadline).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full bg-white" style={{ width: `${task.progress}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Timeline() {
  const [replanning, setReplanning] = useState(false);
  const [replanSuccess, setReplanSuccess] = useState(false);

  const handleReplan = () => {
    setReplanning(true);
    setTimeout(() => {
      setReplanning(false);
      setReplanSuccess(true);
      setTimeout(() => setReplanSuccess(false), 3500);
    }, 900);
  };

  return (
    <div className="h-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timeline & Schedule</h1>
          <p className="mt-1 text-muted-foreground">A single, interactive view of every upcoming task.</p>
        </div>
        <Button
          onClick={handleReplan}
          disabled={replanning}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <RotateCcw className={`w-4 h-4 ${replanning ? 'animate-spin' : ''}`} />
          <span>{replanning ? 'Rebalancing Schedule...' : 'Replan Schedule'}</span>
        </Button>
      </div>

      {replanSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Schedule rebalanced! Tasks distributed within cognitive load limits.</span>
        </div>
      )}

      <Tabs defaultValue="3d" className="flex flex-col">
        <TabsList className="self-start">
          <TabsTrigger value="3d" className="gap-2"><Orbit className="h-4 w-4" />3D View</TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2"><CalendarDays className="h-4 w-4" />Calendar View</TabsTrigger>
          <TabsTrigger value="list" className="gap-2"><List className="h-4 w-4" />List View</TabsTrigger>
        </TabsList>
        <TabsContent value="3d"><ThreeDView /></TabsContent>
        <TabsContent value="calendar"><CalendarView /></TabsContent>
        <TabsContent value="list"><ListView /></TabsContent>
      </Tabs>
    </div>
  );
}