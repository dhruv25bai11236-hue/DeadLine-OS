import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useTasks } from '@/hooks/useTasks';

export function PriorityList() {
  const { tasks } = useTasks();

  const priorityOrder = { High: 3, Medium: 2, Low: 1 };
  const sortedPriorities = tasks
    .filter(t => t.status !== 'Completed')
    .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority] || a.progress - b.progress)
    .slice(0, 3);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          Top Priorities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {sortedPriorities.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">All clear! No active priority tasks.</p>
          ) : (
            sortedPriorities.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 leading-tight">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.course}</p>
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded ${
                    item.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.priority}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={item.progress} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground min-w-[3ch]">{item.progress}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}