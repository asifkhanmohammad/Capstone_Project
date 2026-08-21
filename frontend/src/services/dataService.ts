import {
  Complaint,
  Department,
  TimelineEvent,
  Feedback,
  NotificationItem,
  ServiceRequest,
  ComplaintStatus,
  PriorityLevel,
  ComplaintCategory,
  UserProfile,
} from '../types';
import {
  INITIAL_COMPLAINTS,
  INITIAL_DEPARTMENTS,
  INITIAL_TIMELINE,
  INITIAL_FEEDBACK,
  INITIAL_NOTIFICATIONS,
  INITIAL_SERVICES,
  DEMO_PROFILES,
} from './mockData';
import { calculateDueAt } from '../utils/slaCalculator';
import { apiService } from './api';

const STORAGE_KEYS = {
  COMPLAINTS: 'ccsm_complaints_v1',
  DEPARTMENTS: 'ccsm_departments_v1',
  TIMELINE: 'ccsm_timeline_v1',
  FEEDBACK: 'ccsm_feedback_v1',
  NOTIFICATIONS: 'ccsm_notifications_v1',
  SERVICES: 'ccsm_services_v1',
  CURRENT_ROLE: 'ccsm_current_role_v1',
};

function getLocalData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage save error:', err);
  }
}

class DataService {
  private complaints: Complaint[];
  private departments: Department[];
  private timeline: TimelineEvent[];
  private feedbackList: Feedback[];
  private notifications: NotificationItem[];
  private services: ServiceRequest[];
  private activeRole: 'student' | 'staff' | 'admin' | 'super_admin';

  constructor() {
    this.complaints = getLocalData(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
    this.departments = getLocalData(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    this.timeline = getLocalData(STORAGE_KEYS.TIMELINE, INITIAL_TIMELINE);
    this.feedbackList = getLocalData(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
    this.notifications = getLocalData(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    this.services = getLocalData(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    this.activeRole = getLocalData(STORAGE_KEYS.CURRENT_ROLE, 'student');

    // Save defaults if empty
    setLocalData(STORAGE_KEYS.COMPLAINTS, this.complaints);
    setLocalData(STORAGE_KEYS.DEPARTMENTS, this.departments);
    setLocalData(STORAGE_KEYS.TIMELINE, this.timeline);
    setLocalData(STORAGE_KEYS.FEEDBACK, this.feedbackList);
    setLocalData(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    setLocalData(STORAGE_KEYS.SERVICES, this.services);
  }

  // Active User / Role Switcher
  public getActiveRole() {
    return this.activeRole;
  }

  public setActiveRole(role: 'student' | 'staff' | 'admin' | 'super_admin') {
    this.activeRole = role;
    setLocalData(STORAGE_KEYS.CURRENT_ROLE, role);
  }

  public getActiveUser(): UserProfile {
    return DEMO_PROFILES[this.activeRole] || DEMO_PROFILES.student;
  }

  // Complaints CRUD
  public getComplaints(): Complaint[] {
    return [...this.complaints];
  }

  public getComplaintById(id: string): Complaint | undefined {
    return this.complaints.find((c) => c.id === id || c.complaint_number === id);
  }

  public createComplaint(data: {
    title: string;
    description: string;
    category: ComplaintCategory;
    priority: PriorityLevel;
    location: string;
    evidence_urls?: string[];
  }): Complaint {
    const currentUser = this.getActiveUser();
    const nowIso = new Date().toISOString();
    const count = this.complaints.length + 101;
    const complaintNumber = `CMP-2026-${String(count).padStart(4, '0')}`;
    const dueAt = calculateDueAt(nowIso, data.priority);

    // Find dept if matched
    const deptMatch = this.departments.find(
      (d) => d.name.toLowerCase().includes(data.category.replace('_', ' ')) || d.code.toLowerCase().includes(data.category)
    );

    const newComplaint: Complaint = {
      id: `cmp-${Date.now()}`,
      complaint_number: complaintNumber,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'submitted',
      location: data.location,
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      student_email: currentUser.email,
      department_id: deptMatch?.id || 'dept-1',
      department_name: deptMatch?.name || 'Electrical & Maintenance',
      evidence_urls: data.evidence_urls || [],
      due_at: dueAt,
      created_at: nowIso,
      updated_at: nowIso,
    };

    this.complaints.unshift(newComplaint);
    setLocalData(STORAGE_KEYS.COMPLAINTS, this.complaints);

    // Log timeline event
    this.addTimelineEvent({
      complaint_id: newComplaint.id,
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      user_role: currentUser.role,
      new_status: 'submitted',
      comment: 'Complaint submitted by student.',
      is_internal: false,
    });

    // Notify admins & student
    this.createNotification({
      user_id: currentUser.id,
      title: 'Complaint Registered',
      message: `Your complaint ${newComplaint.complaint_number} has been submitted successfully.`,
      link: `/complaints/${newComplaint.id}`,
      type: 'info',
    });

    return newComplaint;
  }

  public updateComplaintStatus(
    id: string,
    newStatus: ComplaintStatus,
    comment: string,
    isInternal: boolean = false
  ): Complaint | null {
    const complaint = this.getComplaintById(id);
    if (!complaint) return null;

    const oldStatus = complaint.status;
    const currentUser = this.getActiveUser();
    const nowIso = new Date().toISOString();

    complaint.status = newStatus;
    complaint.updated_at = nowIso;

    if (newStatus === 'resolved') {
      complaint.resolved_at = nowIso;
    } else if (newStatus === 'closed') {
      complaint.closed_at = nowIso;
    }

    setLocalData(STORAGE_KEYS.COMPLAINTS, this.complaints);

    // Timeline event
    this.addTimelineEvent({
      complaint_id: complaint.id,
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      user_role: currentUser.role,
      old_status: oldStatus,
      new_status: newStatus,
      comment: comment || `Status updated from ${oldStatus.toUpperCase()} to ${newStatus.toUpperCase()}`,
      is_internal: isInternal,
    });

    // Notify Student
    this.createNotification({
      user_id: complaint.student_id,
      title: `Status Changed: ${complaint.complaint_number}`,
      message: `Your complaint status is now ${newStatus.replace('_', ' ').toUpperCase()}.`,
      link: `/complaints/${complaint.id}`,
      type: newStatus === 'resolved' ? 'success' : 'info',
    });

    return complaint;
  }

  public assignComplaint(id: string, departmentId: string, staffId?: string): Complaint | null {
    const complaint = this.getComplaintById(id);
    if (!complaint) return null;

    const dept = this.departments.find((d) => d.id === departmentId);
    const staff = DEMO_PROFILES.staff;
    const currentUser = this.getActiveUser();

    if (dept) {
      complaint.department_id = dept.id;
      complaint.department_name = dept.name;
    }

    if (staffId) {
      complaint.assigned_staff_id = staff.id;
      complaint.assigned_staff_name = staff.full_name;
    }

    if (complaint.status === 'submitted' || complaint.status === 'verified') {
      complaint.status = 'assigned';
    }

    complaint.updated_at = new Date().toISOString();
    setLocalData(STORAGE_KEYS.COMPLAINTS, this.complaints);

    this.addTimelineEvent({
      complaint_id: complaint.id,
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      user_role: currentUser.role,
      new_status: complaint.status,
      comment: `Assigned to ${dept?.name || 'Department'} ${staffId ? `(Staff: ${staff.full_name})` : ''}`,
      is_internal: false,
    });

    return complaint;
  }

  public updatePriority(id: string, priority: PriorityLevel): Complaint | null {
    const complaint = this.getComplaintById(id);
    if (!complaint) return null;

    complaint.priority = priority;
    complaint.due_at = calculateDueAt(complaint.created_at, priority);
    complaint.updated_at = new Date().toISOString();

    setLocalData(STORAGE_KEYS.COMPLAINTS, this.complaints);

    const currentUser = this.getActiveUser();
    this.addTimelineEvent({
      complaint_id: complaint.id,
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      user_role: currentUser.role,
      comment: `Priority changed to ${priority.toUpperCase()}. SLA due date re-calculated.`,
      is_internal: true,
    });

    return complaint;
  }

  // Timeline
  public getTimelineEvents(complaintId: string): TimelineEvent[] {
    return this.timeline.filter((t) => t.complaint_id === complaintId);
  }

  private addTimelineEvent(event: Omit<TimelineEvent, 'id' | 'created_at'>): void {
    const newEvent: TimelineEvent = {
      ...event,
      id: `tl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    this.timeline.push(newEvent);
    setLocalData(STORAGE_KEYS.TIMELINE, this.timeline);
  }

  // Feedback
  public submitFeedback(complaintId: string, rating: number, comments: string, isSatisfied: boolean): Feedback {
    const currentUser = this.getActiveUser();
    const complaint = this.getComplaintById(complaintId);

    const feedback: Feedback = {
      id: `fb-${Date.now()}`,
      complaint_id: complaintId,
      student_id: currentUser.id,
      rating,
      comments,
      is_satisfied: isSatisfied,
      created_at: new Date().toISOString(),
    };

    this.feedbackList.push(feedback);
    setLocalData(STORAGE_KEYS.FEEDBACK, this.feedbackList);

    // If satisfied, close complaint
    if (complaint) {
      if (isSatisfied) {
        this.updateComplaintStatus(complaintId, 'closed', `Student submitted feedback (${rating}/5 stars). Closed.`);
      } else {
        this.updateComplaintStatus(
          complaintId,
          'reopened',
          `Student marked issue as unresolved (${rating}/5 stars): "${comments}"`
        );
      }
    }

    return feedback;
  }

  public getFeedbackForComplaint(complaintId: string): Feedback | undefined {
    return this.feedbackList.find((f) => f.complaint_id === complaintId);
  }

  public getAllFeedback(): Feedback[] {
    return [...this.feedbackList];
  }

  // Departments
  public getDepartments(): Department[] {
    return [...this.departments];
  }

  // Notifications
  public getNotifications(userId?: string): NotificationItem[] {
    const uid = userId || this.getActiveUser().id;
    return this.notifications.filter((n) => n.user_id === uid || n.user_id === 'all');
  }

  public markNotificationRead(id: string): void {
    const n = this.notifications.find((item) => item.id === id);
    if (n) {
      n.is_read = true;
      setLocalData(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    }
  }

  private createNotification(data: Omit<NotificationItem, 'id' | 'is_read' | 'created_at'>): void {
    const n: NotificationItem = {
      ...data,
      id: `nt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    this.notifications.unshift(n);
    setLocalData(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
  }

  // Service Requests
  public getServiceRequests(): ServiceRequest[] {
    return [...this.services];
  }

  public createServiceRequest(data: {
    service_type: string;
    location: string;
    description: string;
    preferred_slot: string;
  }): ServiceRequest {
    const currentUser = this.getActiveUser();
    const req: ServiceRequest = {
      id: `srv-${Date.now()}`,
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      service_type: data.service_type,
      location: data.location,
      description: data.description,
      preferred_slot: data.preferred_slot,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    this.services.unshift(req);
    setLocalData(STORAGE_KEYS.SERVICES, this.services);
    return req;
  }

  // Reset to initial demo state
  public resetDemoData(): void {
    this.complaints = INITIAL_COMPLAINTS;
    this.departments = INITIAL_DEPARTMENTS;
    this.timeline = INITIAL_TIMELINE;
    this.feedbackList = INITIAL_FEEDBACK;
    this.notifications = INITIAL_NOTIFICATIONS;
    this.services = INITIAL_SERVICES;

    setLocalData(STORAGE_KEYS.COMPLAINTS, this.complaints);
    setLocalData(STORAGE_KEYS.DEPARTMENTS, this.departments);
    setLocalData(STORAGE_KEYS.TIMELINE, this.timeline);
    setLocalData(STORAGE_KEYS.FEEDBACK, this.feedbackList);
    setLocalData(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    setLocalData(STORAGE_KEYS.SERVICES, this.services);
  }
}

export const dataService = new DataService();
