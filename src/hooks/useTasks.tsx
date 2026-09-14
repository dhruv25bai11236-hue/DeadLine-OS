import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface SubtaskItem {
  id: string;
  title: string;
  durationHours: number;
  completed: boolean;
}

export interface TaskMetrics {
  urgency?: number;
  workload?: number;
  difficulty?: number;
  conflictRisk?: number;
}

export interface Task {
  id: string;
  title: string;
  course: string;
  deadline: string;
  priority: TaskPriority;
  description: string;
  source_file_path?: string;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  estimatedHours?: number;
  subtasks?: SubtaskItem[];
  metrics?: TaskMetrics;
  pageCount?: number;
}

type NewTask = Omit<Task, 'id' | 'progress' | 'status'>;
type TaskContextValue = {
  tasks: Task[];
  addTask: (task: NewTask) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const storageKey = user?.id ? `deadlineos_tasks_${user.id}` : 'deadlineos_tasks_guest';
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    let isMounted = true;
    api.listAssignments()
      .then(items => {
        if (isMounted) setTasks((items as any[]).map(toTask));
      })
      .catch(() => {
        if (!isMounted) return;
        try {
          const saved = localStorage.getItem(storageKey);
          setTasks(saved ? JSON.parse(saved) : []);
        } catch {
          setTasks([]);
        }
      });

    return () => { isMounted = false; };
  }, [storageKey]);

  const persist = (next: Task[]) => {
    setTasks(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const value = useMemo(() => ({
    tasks,
    addTask: (task: NewTask) => {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        progress: 0,
        status: 'Not Started',
      };
      persist([...tasks, newTask]);
      void api.createAssignment(toAssignmentInput(task)).catch(() => {});
    },
    updateTask: (task: Task) => {
      persist(tasks.map(current => current.id === task.id ? task : current));
      void api.updateAssignment(task.id, toAssignmentInput(task)).catch(() => {});
    },
    deleteTask: (id: string) => {
      persist(tasks.filter(item => item.id !== id));
      void api.deleteAssignment(id).catch(() => {});
    },
  }), [tasks, storageKey]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

function toTask(item: any): Task {
  return {
    id: item.id,
    title: item.title,
    course: item.subject || '',
    deadline: item.deadline,
    priority: item.priority === 'critical' || item.priority === 'high' ? 'High' : item.priority === 'moderate' ? 'Medium' : 'Low',
    description: item.description || '',
    source_file_path: item.source_file_url || undefined,
    progress: item.progress || 0,
    status: item.status === 'completed' ? 'Completed' : item.status === 'in_progress' ? 'In Progress' : 'Not Started',
    estimatedHours: item.estimated_hours || 6,
    subtasks: item.subtasks || [],
  };
}

function toAssignmentInput(task: NewTask | Task) {
  return {
    title: task.title,
    subject: task.course || 'General',
    deadline: new Date(task.deadline).toISOString(),
    estimated_hours: task.estimatedHours || 6,
    difficulty: task.priority === 'High' ? 'hard' : task.priority === 'Medium' ? 'medium' : 'easy',
    description: task.description,
    assignment_type: 'homework',
    source_file_path: (task as Task & { source_file_path?: string }).source_file_path,
  };
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
}