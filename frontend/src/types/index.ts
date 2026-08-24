export type UserRole = 'student' | 'staff' | 'admin' | 'super_admin';

export type ComplaintCategory =
  | 'electrical'
  | 'plumbing'
  | 'internet_wifi'
  | 'hostel'
  | 'classroom'
  | 'laboratory'
  | 'cleaning'
  | 'transport'
  | 'security'
  | 'canteen'
  | 'library'
  | 'other';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'emergency';

export type ComplaintStatus =
  | 'submitted'
  | 'verified'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'rejected'
  | 'reopened';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department_id?: string;
  department_name?: string;
  phone?: string;
  avatar_url?: string;
  student_id_number?: string;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head_name: string;
  head_email: string;
  created_at: string;
}

export interface Complaint {
  id: string;
  complaint_number: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: PriorityLevel;
  status: ComplaintStatus;
  location: string;
  student_id: string;
  student_name: string;
  student_email: string;
  department_id?: string;
  department_name?: string;
  assigned_staff_id?: string;
  assigned_staff_name?: string;
  evidence_urls: string[];
  due_at: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  closed_at?: string;
  timeline?: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  complaint_id: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  old_status?: ComplaintStatus;
  new_status?: ComplaintStatus;
  comment: string;
  is_internal: boolean;
  created_at: string;
}

export interface Feedback {
  id: string;
  complaint_id: string;
  student_id: string;
  rating: number;
  comments?: string;
  is_satisfied: boolean;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link?: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'sla';
  is_read: boolean;
  created_at: string;
}

export interface ServiceRequest {
  id: string;
  student_id: string;
  student_name: string;
  service_type: string;
  location: string;
  description: string;
  preferred_slot: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

export interface SlaMetrics {
  remainingMinutes: number;
  formattedTime: string;
  isBreached: boolean;
  percentageUsed: number;
  badgeColor: 'green' | 'yellow' | 'red' | 'darkred';
  statusText: string;
}

export interface RecurringAlert {
  category: ComplaintCategory;
  location: string;
  count: number;
  timeWindowHours: number;
  alertMessage: string;
}
