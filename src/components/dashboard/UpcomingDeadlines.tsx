import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTasks } from '@/hooks/useTasks';

export function UpcomingDeadlines() {
  const { tasks } = useTasks();

  const sortedDeadlines = tasks
    .filter(t => t.status !== 'Completed')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 4);

  const getDaysLeft = (deadlineStr: string) => {
    const diffTime = new Date(deadlineStr).getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-rose-600" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedDeadlines.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">No upcoming deadlines found.</p>
          ) : (
            sortedDeadlines.map((task) => {
              const days = getDaysLeft(task.deadline);
              return (
                <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0 gap-2">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">{task.title}</h4>
                    <p className="text-xs text-muted-foreground">{task.course || 'Academic'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 font-medium">
                      {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <Badge variant={days <= 2 ? 'destructive' : 'secondary'}>
                      {days <= 0 ? 'Due Today' : `${days} days left`}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}