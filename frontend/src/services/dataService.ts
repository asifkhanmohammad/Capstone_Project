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
  UserRole,
} from '../types';
import { calculateDueAt } from '../utils/slaCalculator';
import { apiService } from './api';

export const DEMO_PROFILES: Record<string, UserProfile> = {
  student: {
    id: 'usr-student-1',
    full_name: 'Mohammad Asif Khan',
    email: 'asif.khan@student.nriit.edu.in',
    role: 'student',
    department_name: 'Computer Science & Engineering',
    student_id_number: '217W1A0501',
    phone: '+91 98765 43210',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    created_at: new Date().toISOString(),
  },
  staff: {
    id: 'usr-staff-1',
    full_name: 'Sri Ch. Satyanarayana (Senior Electrical Lead)',
    email: 'ramesh.elec@nriit.edu.in',
    role: 'staff',
    department_name: 'Electrical & Power Maintenance',
    department_id: 'dept-1',
    phone: '+91 98765 43211',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    created_at: new Date().toISOString(),
  },
  admin: {
    id: 'usr-admin-1',
    full_name: 'Dr. K.V. Sambasiva Rao (HOD, CSE)',
    email: 'admin@nriit.edu.in',
    role: 'admin',
    department_name: 'IT Infrastructure & Campus Wi-Fi',
    department_id: 'dept-3',
    phone: '+91 94401 23456',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    created_at: new Date().toISOString(),
  },
  super_admin: {
    id: 'usr-superadmin-1',
    full_name: 'Dr. C. Naga Bhaskar (Principal & Campus Director)',
    email: 'principal@nriit.edu.in',
    role: 'super_admin',
    department_name: 'College Administration & Governance',
    phone: '+91 94400 11223',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    created_at: new Date().toISOString(),
  },
};

class DataService {
  private complaintsCache: Complaint[] = [];
  private departmentsCache: Department[] = [];
  private servicesCache: ServiceRequest[] = [];
  private feedbackCache: Feedback[] = [];
  private notificationsCache: NotificationItem[] = [];
  private activeRole: UserRole = 'student';
  private initialized = false;

  constructor() {
    // Determine active role from logged in user in localStorage session token
    try {
      const storedUser = localStorage.getItem('ccsm_auth_user_v1');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.role) this.activeRole = u.role as UserRole;
      }
    } catch {
      this.activeRole = 'student';
    }
  }

  // Synchronize cache with MongoDB database
  public async syncWithBackend(): Promise<void> {
    try {
      const [complaints, departments, services, feedback] = await Promise.all([
        apiService.getComplaints().catch(() => []),
        apiService.getDepartments().catch(() => []),
        apiService.getServiceRequests().catch(() => []),
        apiService.getFeedback().catch(() => []),
      ]);

      this.complaintsCache = complaints;
      this.departmentsCache = departments;
      this.servicesCache = services;
      this.feedbackCache = feedback;
      this.initialized = true;
    } catch (err) {
      console.error('[DataService] Error syncing with Express/MongoDB backend:', err);
    }
  }

  // Active User / Role
  public getActiveRole(): UserRole {
    try {
      const storedUser = localStorage.getItem('ccsm_auth_user_v1');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        return u.role || this.activeRole;
      }
    } catch {
      // fallback
    }
    return this.activeRole;
  }

  public setActiveRole(role: UserRole) {
    this.activeRole = role;
  }

  public getActiveUser(): UserProfile {
    try {
      const storedUser = localStorage.getItem('ccsm_auth_user_v1');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        const fallbackDemo = DEMO_PROFILES[u.role || 'student'] || DEMO_PROFILES.student;
        return {
          id: u.id || fallbackDemo.id,
          full_name: u.full_name || u.name || fallbackDemo.full_name,
          email: u.email || fallbackDemo.email,
          role: u.role || fallbackDemo.role,
          department_name: u.department || u.department_name || fallbackDemo.department_name,
          department_id: u.department_id || fallbackDemo.department_id,
          phone: u.phone || fallbackDemo.phone,
          student_id_number: u.student_id_number || fallbackDemo.student_id_number,
          avatar_url: u.avatar_url || u.avatar || fallbackDemo.avatar_url,
          created_at: u.created_at || new Date().toISOString(),
        };
      }
    } catch {
      // return default
    }
    return DEMO_PROFILES[this.activeRole] || DEMO_PROFILES.student;
  }

  // Complaints API Integration
  public async fetchComplaints(params?: Record<string, string>): Promise<Complaint[]> {
    const data = await apiService.getComplaints(params);
    this.complaintsCache = data;
    return data;
  }

  public getComplaints(): Complaint[] {
    return [...this.complaintsCache];
  }

  public async fetchComplaintById(id: string): Promise<Complaint> {
    const complaint = await apiService.getComplaintById(id);
    const idx = this.complaintsCache.findIndex((c) => c.id === complaint.id);
    if (idx >= 0) this.complaintsCache[idx] = complaint;
    else this.complaintsCache.unshift(complaint);
    return complaint;
  }

  public getComplaintById(id: string): Complaint | undefined {
    return this.complaintsCache.find((c) => c.id === id || c.complaint_number === id);
  }

  public async createComplaint(data: {
    title: string;
    description: string;
    category: ComplaintCategory;
    priority: PriorityLevel;
    location: string;
    evidence_urls?: string[];
  }): Promise<Complaint> {
    const currentUser = this.getActiveUser();
    const nowIso = new Date().toISOString();
    const dueAt = calculateDueAt(nowIso, data.priority);

    const deptMatch = this.departmentsCache.find(
      (d) => d.name.toLowerCase().includes(data.category.replace('_', ' ')) || d.code.toLowerCase().includes(data.category)
    );

    const complaintData: Partial<Complaint> = {
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
      department_name: deptMatch?.name || 'Electrical & Power Maintenance',
      evidence_urls: data.evidence_urls || [],
      due_at: dueAt,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const newComplaint = await apiService.createComplaint(complaintData);
    this.complaintsCache.unshift(newComplaint);
    return newComplaint;
  }

  public async updateComplaintStatus(
    id: string,
    newStatus: ComplaintStatus,
    comment: string,
    isInternal: boolean = false
  ): Promise<Complaint> {
    const currentUser = this.getActiveUser();
    const updated = await apiService.updateComplaintStatus(
      id,
      newStatus,
      comment,
      isInternal,
      currentUser.full_name,
      currentUser.role,
      currentUser.id
    );

    const idx = this.complaintsCache.findIndex((c) => c.id === updated.id);
    if (idx >= 0) this.complaintsCache[idx] = updated;
    return updated;
  }

  public async assignComplaint(id: string, staffId: string, staffName: string): Promise<Complaint> {
    const updated = await apiService.assignComplaint(id, staffId, staffName);
    const idx = this.complaintsCache.findIndex((c) => c.id === updated.id);
    if (idx >= 0) this.complaintsCache[idx] = updated;
    return updated;
  }

  public async reopenComplaint(id: string, comment?: string): Promise<Complaint> {
    const updated = await apiService.reopenComplaint(id, comment);
    const idx = this.complaintsCache.findIndex((c) => c.id === updated.id);
    if (idx >= 0) this.complaintsCache[idx] = updated;
    return updated;
  }

  // Timeline Events
  public getTimelineEvents(complaintId: string): TimelineEvent[] {
    const complaint = this.getComplaintById(complaintId);
    return complaint?.timeline || [];
  }

  // Departments API Integration
  public async fetchDepartments(): Promise<Department[]> {
    const depts = await apiService.getDepartments();
    this.departmentsCache = depts;
    return depts;
  }

  public getDepartments(): Department[] {
    return [...this.departmentsCache];
  }

  public async createDepartment(data: {
    name: string;
    code: string;
    head_name: string;
    head_email: string;
    sla_target_hours?: number;
    monthly_budget?: number;
  }): Promise<Department> {
    const newDept = await apiService.createDepartment(data);
    this.departmentsCache.push(newDept);
    return newDept;
  }

  public async updateDepartment(id: string, data: Partial<Department>): Promise<Department> {
    const updated = await apiService.updateDepartment(id, data);
    const idx = this.departmentsCache.findIndex((d) => d.id === id);
    if (idx >= 0) this.departmentsCache[idx] = updated;
    return updated;
  }

  public async deleteDepartment(id: string): Promise<void> {
    await apiService.deleteDepartment(id);
    this.departmentsCache = this.departmentsCache.filter((d) => d.id !== id);
  }

  // Services API Integration
  public async fetchServiceRequests(studentId?: string): Promise<ServiceRequest[]> {
    const requests = await apiService.getServiceRequests(studentId);
    this.servicesCache = requests;
    return requests;
  }

  public getServiceRequests(): ServiceRequest[] {
    return [...this.servicesCache];
  }

  public async createServiceRequest(data: {
    service_type: string;
    location: string;
    description: string;
    preferred_slot: string;
  }): Promise<ServiceRequest> {
    const currentUser = this.getActiveUser();
    const newReq = await apiService.createServiceRequest({
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      service_type: data.service_type,
      location: data.location,
      description: data.description,
      preferred_slot: data.preferred_slot,
      status: 'pending',
    });
    this.servicesCache.unshift(newReq);
    return newReq;
  }

  public async updateServiceRequestStatus(id: string, status: 'pending' | 'scheduled' | 'completed' | 'cancelled'): Promise<ServiceRequest> {
    const updated = await apiService.updateServiceRequestStatus(id, status);
    const idx = this.servicesCache.findIndex((s) => s.id === id);
    if (idx >= 0) this.servicesCache[idx] = updated;
    return updated;
  }

  // Feedback API Integration
  public async fetchFeedback(): Promise<Feedback[]> {
    const fb = await apiService.getFeedback();
    this.feedbackCache = fb;
    return fb;
  }

  public getAllFeedback(): Feedback[] {
    return [...this.feedbackCache];
  }

  public getFeedbackForComplaint(complaintId: string): Feedback | undefined {
    return this.feedbackCache.find((f) => f.complaint_id === complaintId);
  }

  public async submitFeedback(
    complaintId: string,
    rating: number,
    comments?: string,
    isSatisfied: boolean = true
  ): Promise<Feedback> {
    const currentUser = this.getActiveUser();
    const fb = await apiService.createFeedback({
      complaint_id: complaintId,
      student_id: currentUser.id,
      rating,
      comments,
      is_satisfied: isSatisfied,
    });
    this.feedbackCache.unshift(fb);
    return fb;
  }

  // Notifications API Integration
  public async fetchNotifications(userId: string): Promise<NotificationItem[]> {
    const notifs = await apiService.getNotifications(userId).catch(() => []);
    this.notificationsCache = notifs;
    return notifs;
  }

  public getNotifications(userId: string): NotificationItem[] {
    return this.notificationsCache.filter((n) => n.user_id === userId);
  }

  public async markNotificationRead(id: string): Promise<void> {
    await apiService.markNotificationRead(id).catch(() => {});
    const notif = this.notificationsCache.find((n) => n.id === id);
    if (notif) notif.is_read = true;
  }
}

export const dataService = new DataService();
