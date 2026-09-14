import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Mock data
const assignment = {
  id: '1',
  title: 'Calculus Assignment 4',
  course: 'MATH 101',
  description: 'Complete chapters 4 and 5 problems from the textbook. Focus on integration techniques.',
  deadline: '2026-09-15T23:59:00Z',
  priority: 'High',
  status: 'In Progress',
  progress: 40,
  subtasks: [
    { id: 't1', title: 'Read chapter 4', completed: true },
    { id: 't2', title: 'Solve problems 1-15', completed: false },
    { id: 't3', title: 'Read chapter 5', completed: false },
  ]
};

export default function AssignmentDetail() {
  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex gap-2 items-center mb-2">
            <span className="text-sm font-semibold text-muted-foreground">{assignment.course}</span>
            <Badge variant="destructive">{assignment.priority}</Badge>
            <Badge variant="outline">{assignment.status}</Badge>
          </div>
          <h1 className="text-4xl font-bold">{assignment.title}</h1>
          <p className="text-muted-foreground mt-2">Due: {new Date(assignment.deadline).toLocaleString()}</p>
        </div>
        <Button variant="outline">Edit</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{assignment.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>{assignment.progress}% Completed</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-4 bg-secondary rounded-full overflow-hidden mb-6">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${assignment.progress}%` }}
                />
              </div>
              
              <h3 className="font-semibold mb-3">Subtasks</h3>
              <ul className="space-y-2">
                {assignment.subtasks.map(task => (
                  <li key={task.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={task.completed} readOnly className="rounded border-gray-300 text-primary focus:ring-primary" />
                    <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                      {task.title}
                    </span>
                  </li>
                ))}
              </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
