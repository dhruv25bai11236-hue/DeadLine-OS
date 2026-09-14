import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { Link } from 'react-router-dom';

export function TodaysMission() {
  const { tasks } = useTasks();
  const activeTasks = tasks.filter(t => t.status !== 'Completed').slice(0, 3);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          Today's Mission
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeTasks.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-sm">
              <p>No active tasks for today!</p>
              <Link to="/assignments" className="text-indigo-600 font-semibold text-xs hover:underline mt-1 inline-block">
                + Add an assignment
              </Link>
            </div>
          ) : (
            activeTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="flex flex-col max-w-[70%]">
                  <span className="font-semibold text-sm truncate text-slate-800">{task.title}</span>
                  <span className="text-xs text-muted-foreground">{task.course || 'General Course'}</span>
                </div>
                <Badge variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'default' : 'secondary'}>
                  {task.priority}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}