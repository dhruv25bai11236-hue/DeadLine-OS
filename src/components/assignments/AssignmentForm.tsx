import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { FileUp, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';

interface AssignmentFormProps {
  onCancel?: () => void;
  onSubmit?: (data: any) => void;
  initialData?: any;
}

export default function AssignmentForm({ onCancel, onSubmit, initialData }: AssignmentFormProps) {
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(initialData || {
    title: '',
    course: '',
    deadline: toDateTimeLocal(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString()),
    priority: 'Medium',
    description: '',
    estimatedHours: 6,
    subtasks: [],
    pageCount: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.deadline && onSubmit) {
      onSubmit(formData);
    }
  };

  const parseFileLocally = (file: File) => {
    const rawName = file.name.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ').trim();
    const courseMatch = rawName.match(/\b([A-Za-z]{2,4}\s*\d{2,4})\b/);
    const course = courseMatch ? courseMatch[1].toUpperCase() : 'General';
    const title = rawName.replace(courseMatch ? courseMatch[0] : '', '').trim() || rawName;
    const defaultDeadline = toDateTimeLocal(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString());

    return {
      title: title.charAt(0).toUpperCase() + title.slice(1),
      course: course,
      deadline: defaultDeadline,
      priority: /final|exam|project|urgent/i.test(rawName) ? 'High' : 'Medium',
      description: `Uploaded from ${file.name}. Review requirements and deliverables.`,
      estimatedHours: 8,
      subtasks: [
        { id: '1', title: 'Review requirements and setup methodology', durationHours: 2.5, completed: false },
        { id: '2', title: 'Core problem solving & drafting', durationHours: 3.5, completed: false },
        { id: '3', title: 'Review solutions, verification & final submission', durationHours: 2.0, completed: false },
      ],
      pageCount: 1,
    };
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalysisLoading(true);
    setUploadedFile(file.name);

    try {
      const response: any = await api.analyzePdf(file);
      const result = response?.data || response;

      if (result) {
        const parsedSubtasks = (result.subtasks || []).map((s: any, idx: number) => ({
          id: `st-${idx}-${Date.now()}`,
          title: s.title,
          durationHours: Math.round(((s.estimated_minutes || 60) / 60) * 10) / 10,
          completed: false,
        }));

        setFormData((current: any) => ({
          ...current,
          source_file_path: result.source_file_path,
          title: result.title || current.title,
          course: result.subject || current.course,
          deadline: result.deadline ? toDateTimeLocal(result.deadline) : current.deadline,
          description: result.description || current.description,
          priority: result.difficulty === 'hard' ? 'High' : result.difficulty === 'easy' ? 'Low' : 'Medium',
          estimatedHours: result.estimated_hours || (parsedSubtasks.length ? parsedSubtasks.reduce((a: any, b: any) => a + b.durationHours, 0) : 6),
          subtasks: parsedSubtasks.length ? parsedSubtasks : [
            { id: '1', title: 'Initial research and problem scoping', durationHours: 2.0, completed: false },
            { id: '2', title: 'Core deliverable development', durationHours: 3.0, completed: false },
            { id: '3', title: 'Verification and final polish', durationHours: 2.0, completed: false },
          ],
          pageCount: result.page_count || 1,
        }));
      }
    } catch {
      const localExtracted = parseFileLocally(file);
      setFormData((current: any) => ({
        ...current,
        ...localExtracted,
      }));
    } finally {
      setAnalysisLoading(false);
      e.target.value = '';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {initialData ? 'Edit Assignment' : 'Add New Assignment'}
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          <div className="relative border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 hover:bg-indigo-50/60 transition-all rounded-2xl p-5 text-center cursor-pointer group">
            <input 
              id="assignment-pdf" 
              type="file" 
              accept="application/pdf,.pdf" 
              onChange={handlePdfUpload} 
              disabled={analysisLoading}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                {analysisLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : uploadedFile ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <FileUp className="w-5 h-5" />
                )}
              </div>
              
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {analysisLoading ? 'Extracting assignment & subtasks...' : uploadedFile ? `✓ Loaded: ${uploadedFile}` : 'Upload any assignment PDF'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automatically extracts deadline, course, subtasks, and workload hours.
                </p>
              </div>

              {uploadedFile && !analysisLoading && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mt-1">
                  <Sparkles className="w-3 h-3" /> Auto-filled from PDF
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-bold text-slate-700">Assignment Title</Label>
            <Input 
              id="title"
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Operating System 1" 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="course" className="text-xs font-bold text-slate-700">Course / Subject</Label>
              <Input 
                id="course"
                value={formData.course}
                onChange={e => setFormData({...formData, course: e.target.value})}
                placeholder="e.g. CS 161" 
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="deadline" className="text-xs font-bold text-slate-700">Deadline</Label>
              <Input 
                id="deadline"
                type="datetime-local" 
                required
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="priority" className="text-xs font-bold text-slate-700">Priority</Label>
              <select 
                id="priority"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value as any})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High / Critical</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="estimatedHours" className="text-xs font-bold text-slate-700">Estimated Total Workload (Hours)</Label>
              <Input 
                id="estimatedHours"
                type="number"
                min="1"
                max="60"
                value={formData.estimatedHours || 6}
                onChange={e => setFormData({...formData, estimatedHours: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-bold text-slate-700">Requirements & Description</Label>
            <textarea 
              id="description"
              className="flex min-h-[90px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Details extracted from document..."
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Save Assignment
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}