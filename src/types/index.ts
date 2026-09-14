// ============================================================
// DeadlineOS AI — Shared Type Definitions
// ============================================================

// --- Enums ---

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type AssignmentType =
  | 'homework' | 'lab' | 'project' | 'quiz'
  | 'presentation' | 'report' | 'other';

export type AssignmentStatus =
  | 'not_started' | 'in_progress' | 'completed' | 'overdue';

export type PriorityLevel = 'low' | 'moderate' | 'high' | 'critical';

export type ScheduleBlockStatus =
  | 'scheduled' | 'in_progress' | 'completed' | 'missed' | 'rescheduled';

export type RecommendationType =
  | 'deadline_warning' | 'workload_alert' | 'scheduling_suggestion'
  | 'progress_insight' | 'conflict_detected';

export type SeverityLevel = 'info' | 'warning' | 'critical';

export type PlanningTrigger =
  | 'manual' | 'auto_replan' | 'assignment_change'
  | 'session_complete' | 'session_missed';

// --- Database Row Types ---

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  description: string | null;
  deadline: string;
  estimated_hours: number;
  actual_hours: number;
  difficulty: DifficultyLevel;
  priority: PriorityLevel;
  priority_score: number;
  status: AssignmentStatus;
  progress: number;
  assignment_type: AssignmentType;
  source_file_url: string | null;
  created_at: string;
  updated_at: string;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  assignment_id: string;
  title: string;
  estimated_minutes: number;
  completed: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ScheduleBlock {
  id: string;
  user_id: string;
  assignment_id: string;
  date: string;
  start_time: string;
  end_time: string;
  planned_minutes: number;
  completed_minutes: number;
  status: ScheduleBlockStatus;
  created_at: string;
  updated_at: string;
  assignment?: Assignment;
}

export interface StudySession {
  id: string;
  user_id: string;
  assignment_id: string;
  schedule_block_id: string | null;
  started_at: string;
  ended_at: string | null;
  planned_minutes: number;
  actual_minutes: number;
  created_at: string;
}

export interface UserAvailability {
  id: string;
  user_id: string;
  day_of_week: number; // 0=Sunday, 6=Saturday
  start_time: string;  // HH:MM
  end_time: string;    // HH:MM
  created_at: string;
}

export interface AIRecommendation {
  id: string;
  user_id: string;
  assignment_id: string | null;
  type: RecommendationType;
  message: string;
  severity: SeverityLevel;
  created_at: string;
}

export interface PlanningRun {
  id: string;
  user_id: string;
  trigger: PlanningTrigger;
  created_at: string;
}

// --- API Request Types ---

export interface CreateAssignmentInput {
  title: string;
  subject: string;
  description?: string;
  deadline: string;
  estimated_hours: number;
  difficulty: DifficultyLevel;
  assignment_type: AssignmentType;
  subtasks?: { title: string; estimated_minutes: number }[];
}

export interface UpdateAssignmentInput {
  title?: string;
  subject?: string;
  description?: string;
  deadline?: string;
  estimated_hours?: number;
  difficulty?: DifficultyLevel;
  assignment_type?: AssignmentType;
  status?: AssignmentStatus;
  progress?: number;
  actual_hours?: number;
}

export interface AIAnalysisResult {
  title: string;
  subject: string;
  deadline: string | null;
  assignment_type: AssignmentType;
  estimated_hours: number;
  difficulty: DifficultyLevel;
  description: string;
  subtasks: { title: string; estimated_minutes: number }[];
  important_instructions: string[];
  workload_rationale: string;
}

export interface ScheduleGenerateRequest {
  trigger?: PlanningTrigger;
}

export interface WhatIfScenario {
  type: 'skip_today' | 'add_assignment' | 'move_deadline';
  assignment_id?: string;
  new_deadline?: string;
  new_assignment?: CreateAssignmentInput;
}

export interface WhatIfResult {
  scenario: string;
  impact: string;
  affected_assignments: string[];
  workload_shift: { from: string; to: string; hours: number }[];
  feasible: boolean;
  warnings: string[];
}

// --- API Response Types ---

export interface DashboardStats {
  active_assignments: number;
  remaining_workload_hours: number;
  urgent_count: number;
  completion_rate: number;
  today_blocks: ScheduleBlock[];
  upcoming_deadlines: Assignment[];
  priority_assignments: Assignment[];
  recent_activity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type:
    | 'assignment_created' | 'assignment_completed' | 'assignment_edited'
    | 'schedule_changed' | 'session_completed' | 'session_missed'
    | 'replan_triggered';
  message: string;
  timestamp: string;
  assignment_id?: string;
}

export interface AnalyticsData {
  total_assignments: number;
  completed_assignments: number;
  remaining_assignments: number;
  total_workload_hours: number;
  remaining_workload_hours: number;
  on_time_completion_rate: number;
  average_completion_hours: number;
  missed_sessions: number;
  workload_by_subject: { subject: string; hours: number }[];
  workload_by_week: { week: string; hours: number }[];
  deadline_pressure: { date: string; count: number; total_hours: number }[];
}

export interface ConflictInfo {
  block_id: string;
  assignment_title: string;
  date: string;
  time_range: string;
  explanation: string;
  ai_suggestion?: string;
}

export interface ReplanResult {
  changes: {
    type: 'added' | 'moved' | 'removed';
    block: ScheduleBlock;
    reason: string;
  }[];
  explanation: string;
  warnings: string[];
}

// --- Demo types ---

export interface DemoState {
  assignments: Assignment[];
  subtasks: Subtask[];
  schedule_blocks: ScheduleBlock[];
  recommendations: AIRecommendation[];
  analytics: AnalyticsData;
  is_demo: boolean;
}

// --- Notification types ---

export interface AppNotification {
  id: string;
  type: 'deadline' | 'conflict' | 'missed_session' | 'replan' | 'completion';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  assignment_id?: string;
}
