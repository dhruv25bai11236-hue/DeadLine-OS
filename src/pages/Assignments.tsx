import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import AssignmentForm from '@/components/assignments/AssignmentForm';
import { useTasks, Task } from '@/hooks/useTasks';
import { Plus, CheckCircle, Clock, Trash2, Edit3, Sliders } from 'lucide-react';

export default function Assignments() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [managingTask, setManagingTask] = useState<Task | null>(null);
  const { tasks, addTask, updateTask, deleteTask } = useTasks();

  const filteredAssignments = tasks.filter((a) =>
    `${a.title} ${a.course}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuickProgress = (task: Task, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newProgress = Math.min(100, Math.max(0, task.progress + delta));
    const newStatus: Task['status'] = newProgress === 100 ? 'Completed' : newProgress > 0 ? 'In Progress' : 'Not Started';
    updateTask({ ...task, progress: newProgress, status: newStatus });
  };

  const handleToggleComplete = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.status === 'Completed') {
      updateTask({ ...task, progress: 0, status: 'Not Started' });
    } else {
      updateTask({ ...task, progress: 100, status: 'Completed' });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Assignments & Tasks</h1>
          <p className="mt-1 text-slate-500">Track, update progress, and manage deliverables.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Assignment</span>
        </Button>
      </div>

      <div className="flex gap-4">
        <Input 
          placeholder="Search by title or course..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map((assignment) => (
          <Card 
            key={assignment.id} 
            onClick={() => setManagingTask(assignment)}
            className="hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all border-slate-200/90 flex flex-col justify-between group"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge variant={assignment.priority === 'High' ? 'destructive' : assignment.priority === 'Medium' ? 'default' : 'secondary'}>
                  {assignment.priority}
                </Badge>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {assignment.course || 'General'}
                </span>
              </div>
              <CardTitle className="mt-2 text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                {assignment.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-1.5 text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>Due: {new Date(assignment.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              <p className="text-xs text-slate-600 line-clamp-2 min-h-[32px]">
                {assignment.description || 'No detailed instructions provided.'}
              </p>

              {/* Progress and quick update controls */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{assignment.status}</span>
                  <span className="font-bold text-indigo-600">{assignment.progress}%</span>
                </div>
                
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${assignment.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                    style={{ width: `${assignment.progress}%` }}
                  />
                </div>

                {/* Quick actions directly on the card */}
                <div className="flex items-center justify-between pt-2 gap-2">
                  <div className="flex gap-1.5">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 px-2 text-xs" 
                      onClick={(e) => handleQuickProgress(assignment, 25, e)}
                    >
                      +25%
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 px-2 text-xs" 
                      onClick={(e) => handleQuickProgress(assignment, -25, e)}
                    >
                      -25%
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant={assignment.status === 'Completed' ? 'default' : 'outline'}
                    className={`h-7 px-2.5 text-xs flex items-center gap-1 ${assignment.status === 'Completed' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
                    onClick={(e) => handleToggleComplete(assignment, e)}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{assignment.status === 'Completed' ? 'Done' : 'Mark Done'}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!filteredAssignments.length && (
        <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <p className="font-semibold">No assignments match your criteria.</p>
          <Button onClick={() => setCreateOpen(true)} variant="link" className="text-indigo-600 mt-2">
            Create your first task
          </Button>
        </div>
      )}

      {/* Create New Assignment Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto p-0 max-h-[90vh]">
          <AssignmentForm onCancel={() => setCreateOpen(false)} onSubmit={(task) => { addTask(task); setCreateOpen(false); }} />
        </DialogContent>
      </Dialog>

      {/* Edit & Manage Progress Dialog */}
      {managingTask && (
        <Dialog open={!!managingTask} onOpenChange={(open) => !open && setManagingTask(null)}>
          <DialogContent className="max-w-md p-6 space-y-5">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{managingTask.course}</Badge>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-8 w-8"
                  onClick={() => { deleteTask(managingTask.id); setManagingTask(null); }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <DialogTitle className="text-xl font-bold">{managingTask.title}</DialogTitle>
            </DialogHeader>

            {/* Live Progress Slider */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  Progress
                </span>
                <span className="text-indigo-600 text-base">{managingTask.progress}%</span>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={managingTask.progress}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const status: Task['status'] = val === 100 ? 'Completed' : val > 0 ? 'In Progress' : 'Not Started';
                  setManagingTask({ ...managingTask, progress: val, status });
                }}
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />

              <div className="flex justify-between text-xs text-slate-500 pt-1">
                <button type="button" onClick={() => setManagingTask({ ...managingTask, progress: 0, status: 'Not Started' })} className="hover:underline">0%</button>
                <button type="button" onClick={() => setManagingTask({ ...managingTask, progress: 25, status: 'In Progress' })} className="hover:underline">25%</button>
                <button type="button" onClick={() => setManagingTask({ ...managingTask, progress: 50, status: 'In Progress' })} className="hover:underline">50%</button>
                <button type="button" onClick={() => setManagingTask({ ...managingTask, progress: 75, status: 'In Progress' })} className="hover:underline">75%</button>
                <button type="button" onClick={() => setManagingTask({ ...managingTask, progress: 100, status: 'Completed' })} className="hover:underline font-semibold text-emerald-600">100%</button>
              </div>
            </div>

            {/* Status Selector */}
            <div className="space-y-2">
              <Label>Task Status</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['Not Started', 'In Progress', 'Completed'] as Task['status'][]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      const prog = st === 'Completed' ? 100 : st === 'Not Started' ? 0 : (managingTask.progress === 0 || managingTask.progress === 100 ? 50 : managingTask.progress);
                      setManagingTask({ ...managingTask, status: st, progress: prog });
                    }}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${
                      managingTask.status === st
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-title">Assignment Title</Label>
                <Input 
                  id="edit-title" 
                  value={managingTask.title} 
                  onChange={(e) => setManagingTask({ ...managingTask, title: e.target.value })} 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-course">Course</Label>
                  <Input 
                    id="edit-course" 
                    value={managingTask.course} 
                    onChange={(e) => setManagingTask({ ...managingTask, course: e.target.value })} 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <select
                    id="edit-priority"
                    value={managingTask.priority}
                    onChange={(e) => setManagingTask({ ...managingTask, priority: e.target.value as any })}
                    className="w-full h-10 px-3 py-2 text-sm bg-white border border-slate-200 rounded-md"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 flex gap-2">
              <Button variant="outline" onClick={() => setManagingTask(null)}>
                Cancel
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => {
                  updateTask(managingTask);
                  setManagingTask(null);
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}