import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';

interface Insight {
  id: string;
  type: 'recommendation' | 'warning' | 'insight';
  message: string;
}

export function AIInsightsPanel() {
  const { tasks } = useTasks();

  const dynamicInsights = useMemo<Insight[]>(() => {
    if (tasks.length === 0) {
      return [
        {
          id: 'welcome',
          type: 'recommendation',
          message: 'Upload your first syllabus or add an assignment to activate autonomous workload recommendations.',
        },
        {
          id: 'setup',
          type: 'insight',
          message: 'Pacing rules are active: Study blocks will automatically cap at 2 hours with 15-minute buffers.',
        },
      ];
    }

    const insights: Insight[] = [];

    // 1. Deadline urgency check
    const urgentTasks = tasks.filter(t => {
      const days = Math.ceil((new Date(t.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days <= 2 && t.status !== 'Completed';
    });

    if (urgentTasks.length > 0) {
      insights.push({
        id: 'urgent',
        type: 'warning',
        message: `High Urgency: "${urgentTasks[0].title}" is due soon. Focus your first morning block on its highest-weight subtask.`,
      });
    }

    // 2. Heavy workload subject check
    const subjectCounts = tasks.reduce((acc, t) => {
      const c = t.course || 'General';
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const heaviestCourse = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0];
    if (heaviestCourse && heaviestCourse[1] > 1) {
      insights.push({
        id: 'subject',
        type: 'recommendation',
        message: `Concentrated Workload: You have ${heaviestCourse[1]} deliverables in ${heaviestCourse[0]}. We recommend interleaving 45-minute blocks with lighter subjects.`,
      });
    }

    // 3. Completion velocity & momentum
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const avgProg = Math.round(tasks.reduce((acc, t) => acc + t.progress, 0) / tasks.length);

    if (completed > 0) {
      insights.push({
        id: 'velocity',
        type: 'insight',
        message: `Velocity Momentum: You have completed ${completed} task(s), reaching an average ${avgProg}% completion score across all coursework.`,
      });
    } else {
      insights.push({
        id: 'pacing',
        type: 'insight',
        message: `Cognitive Load Safeguard: Pacing prevents cramming by restricting daily study sessions to 6 hours maximum.`,
      });
    }

    return insights;
  }, [tasks]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <Lightbulb className="w-4 h-4 text-amber-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'insight': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      default: return <Brain className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <Card className="bg-indigo-50/20 border-indigo-100 h-full shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-indigo-900 text-lg">
          <Brain className="w-5 h-5 text-indigo-600" />
          Autonomous AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3.5">
          {dynamicInsights.map((insight) => (
            <div key={insight.id} className="flex gap-3 items-start bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="mt-0.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100 shrink-0">
                {getIcon(insight.type)}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {insight.message}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}