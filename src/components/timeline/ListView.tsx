import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTasks } from '@/hooks/useTasks';

export default function ListView() {
  const { tasks } = useTasks();
  const groupedItems = [...tasks].sort((a, b) => +new Date(a.deadline) - +new Date(b.deadline)).reduce((acc, item) => {
    const date = format(new Date(item.deadline), 'EEEE, MMMM d');
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {} as Record<string, typeof tasks>);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {Object.entries(groupedItems).map(([date, items]) => (
        <div key={date}>
          <h3 className="text-xl font-semibold mb-4 sticky top-0 bg-background/95 py-2 backdrop-blur z-10 border-b">
            {date}
          </h3>
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="text-sm font-medium w-32 text-muted-foreground">
                      {format(new Date(item.deadline), 'h:mm a')}
                    </div>
                    <div className="h-8 w-1 bg-primary rounded-full"></div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.course || 'Personal task'}</p>
                    </div>
                  </div>
                  <Badge variant={item.priority === 'High' ? 'destructive' : 'outline'}>{item.priority}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
