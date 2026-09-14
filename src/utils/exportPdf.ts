import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
}

interface ScheduleBlock {
  id: string;
  assignmentId: string;
  title: string;
  startTime: string;
  endTime: string;
}

export const exportTimelineToPdf = (assignments: Assignment[], schedule: ScheduleBlock[]) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('DeadlineOS - Timeline & Assignments', 14, 22);

  doc.setFontSize(14);
  doc.text('Assignments', 14, 32);

  const assignmentData = assignments.map(a => [
    a.title,
    a.course,
    new Date(a.dueDate).toLocaleDateString(),
    a.priority,
    a.status
  ]);

  autoTable(doc, {
    startY: 36,
    head: [['Title', 'Course', 'Due Date', 'Priority', 'Status']],
    body: assignmentData,
  });

  const finalY = (doc as any).lastAutoTable.finalY || 40;

  doc.text('Schedule', 14, finalY + 10);

  const scheduleData = schedule.map(s => [
    s.title,
    new Date(s.startTime).toLocaleString(),
    new Date(s.endTime).toLocaleString()
  ]);

  autoTable(doc, {
    startY: finalY + 14,
    head: [['Task', 'Start Time', 'End Time']],
    body: scheduleData,
  });

  doc.save('deadlineos-timeline.pdf');
};
