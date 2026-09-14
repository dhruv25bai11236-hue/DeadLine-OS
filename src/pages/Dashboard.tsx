import { StatCard } from '@/components/dashboard/StatCard';
import { TodaysMission } from '@/components/dashboard/TodaysMission';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { PriorityList } from '@/components/dashboard/PriorityList';
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel';
import { AssignmentMatrixSection } from '@/components/dashboard/AssignmentMatrixSection';
import { BookOpen, CheckCircle, Target, Zap } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';

export default function Dashboard() {
  const { tasks } = useTasks();

  const activeCount = tasks.filter(t => t.status !== 'Completed').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const avgProgress = tasks.length 
    ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length) 
    : 0;
  const highPriorityCount = tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here is your live academic overview.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Assignments"
          value={activeCount}
          icon={BookOpen}
        />
        <StatCard
          title="Tasks Completed"
          value={completedCount}
          icon={CheckCircle}
        />
        <StatCard
          title="Average Progress"
          value={`${avgProgress}%`}
          icon={Target}
        />
        <StatCard
          title="Critical Deadlines"
          value={highPriorityCount}
          icon={Zap}
        />
      </div>

      {/* Autonomous Scoring Matrix & Subtask Decomposition Section */}
      <AssignmentMatrixSection />

      {/* Secondary Overview & Dynamic Insights */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <TodaysMission />
            <PriorityList />
          </div>
          <UpcomingDeadlines />
        </div>
        
        <div className="lg:col-span-1">
          <AIInsightsPanel />
        </div>
      </div>
    </div>
  );
}