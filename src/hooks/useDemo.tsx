import { createContext, useContext, useState, ReactNode } from 'react';

export interface DemoState {
  isDemo: boolean;
  assignments: any[];
  schedule: any[];
  setDemoMode: (isDemo: boolean) => void;
}

const mockAssignments = [
  { id: '1', title: 'Calculus Midterm', course: 'Math 101', dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), priority: 'high', status: 'pending' },
  { id: '2', title: 'React Project', course: 'Web Dev', dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), priority: 'medium', status: 'in_progress' }
];

const mockSchedule = [
  { id: '1', assignmentId: '1', title: 'Study Chapters 1-3', startTime: new Date().toISOString(), endTime: new Date(Date.now() + 3600000 * 2).toISOString() }
];

const DemoContext = createContext<DemoState | undefined>(undefined);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [isDemo, setDemoMode] = useState(true);

  return (
    <DemoContext.Provider value={{
      isDemo,
      assignments: isDemo ? mockAssignments : [],
      schedule: isDemo ? mockSchedule : [],
      setDemoMode
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
