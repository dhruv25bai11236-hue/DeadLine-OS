import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useTasks } from '@/hooks/useTasks';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Analytics() {
  const { tasks } = useTasks();

  // Workload grouped by user's courses
  const workloadBySubject = Object.entries(
    tasks.reduce((acc, t) => {
      const course = t.course || 'General';
      acc[course] = (acc[course] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([subject, count]) => ({
    subject,
    tasks: count,
  }));

  // Progress funnel from real status
  const funnelData = [
    { stage: 'Not Started', count: tasks.filter(t => t.status === 'Not Started').length },
    { stage: 'In Progress', count: tasks.filter(t => t.status === 'In Progress').length },
    { stage: 'Completed', count: tasks.filter(t => t.status === 'Completed').length },
  ];

  // Priority distribution
  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'High').length },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length },
    { name: 'Low', value: tasks.filter(t => t.priority === 'Low').length },
  ].filter(p => p.value > 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Academic Analytics</h1>
        <p className="text-muted-foreground">Real-time statistics calculated directly from your assignments.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Subject</CardTitle>
            <CardDescription>Deliverables distribution across enrolled courses</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {workloadBySubject.length === 0 ? (
              <div className="flex h-full items-center justify-center text-slate-400 text-sm">Add assignments to view course workload.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workloadBySubject} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="subject" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="tasks" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Funnel</CardTitle>
            <CardDescription>Live breakdown by assignment status</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="stage" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Priority Balance</CardTitle>
            <CardDescription>Distribution of High vs Medium vs Low urgency tasks</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] flex justify-center">
            {priorityData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-slate-400 text-sm">No tasks available for priority breakdown.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {priorityData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}