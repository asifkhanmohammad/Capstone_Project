import { Complaint, Department, ServiceRequest, Feedback, NotificationItem, UserProfile } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('ccsm_auth_token_v1');
  const userItem = localStorage.getItem('ccsm_auth_user_v1');
  let userId = '';
  if (userItem) {
    try {
      userId = JSON.parse(userItem).id || '';
    } catch {
      userId = '';
    }
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) defaultHeaders['Authorization'] = `Bearer ${token}`;
  if (userId) defaultHeaders['x-user-id'] = userId;

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      let errMsg = `Server returned status ${res.status}`;
      try {
        const errJson = await res.json();
        if (errJson.error) errMsg = errJson.error;
      } catch {
        // use status message
      }
      throw new Error(errMsg);
    }

    return (await res.json()) as T;
  } catch (err: any) {
    throw err;
  }
}

export const apiService = {
  // Auth API
  async login(email: string, password?: string, role?: string): Promise<{ token: string; user: UserProfile }> {
    return fetchJSON<{ token: string; user: UserProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  },

  async register(data: { name: string; email: string; password?: string; role?: string; department?: string; phone?: string }): Promise<{ token: string; user: UserProfile }> {
    return fetchJSON<{ token: string; user: UserProfile }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async googleLogin(payload: { email?: string; name?: string; picture?: string; credential?: string; role?: string }): Promise<{ token: string; user: UserProfile }> {
    return fetchJSON<{ token: string; user: UserProfile }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },


  async getMe(): Promise<UserProfile> {
    return fetchJSON<UserProfile>('/auth/me');
  },

  // Complaints API
  async getComplaints(params?: Record<string, string>): Promise<Complaint[]> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchJSON<Complaint[]>(`/complaints${query}`);
  },

  async getMyComplaints(studentId?: string): Promise<Complaint[]> {
    const query = studentId ? `?student_id=${encodeURIComponent(studentId)}` : '';
    return fetchJSON<Complaint[]>(`/complaints/my${query}`);
  },

  async getComplaintById(id: string): Promise<Complaint> {
    return fetchJSON<Complaint>(`/complaints/${id}`);
  },

  async createComplaint(data: Partial<Complaint>): Promise<Complaint> {
    return fetchJSON<Complaint>('/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateComplaint(id: string, updates: Partial<Complaint>): Promise<Complaint> {
    return fetchJSON<Complaint>(`/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async updateComplaintStatus(
    id: string,
    status: string,
    comment?: string,
    isInternal?: boolean,
    updatedByName?: string,
    updatedByRole?: string,
    updatedById?: string
  ): Promise<Complaint> {
    return fetchJSON<Complaint>(`/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        comment,
        is_internal: isInternal,
        updated_by_name: updatedByName,
        updated_by_role: updatedByRole,
        updated_by_id: updatedById,
      }),
    });
  },

  async assignComplaint(id: string, staffId: string, staffName: string): Promise<Complaint> {
    return fetchJSON<Complaint>(`/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'assigned',
        assigned_staff_id: staffId,
        assigned_staff_name: staffName,
        comment: `Complaint assigned to ${staffName}`,
      }),
    });
  },

  async reopenComplaint(id: string, comment?: string): Promise<Complaint> {
    return fetchJSON<Complaint>(`/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'reopened',
        comment: comment || 'Complaint reopened by student.',
      }),
    });
  },

  async getComplaintStatistics(): Promise<{
    total: number;
    pending: number;
    resolved: number;
    closed: number;
    highPriority: number;
    byCategory: Record<string, number>;
    byDepartment: Record<string, number>;
  }> {
    return fetchJSON('/complaints/stats');
  },

  // Departments API
  async getDepartments(): Promise<Department[]> {
    return fetchJSON<Department[]>('/departments');
  },

  async createDepartment(data: Partial<Department>): Promise<Department> {
    return fetchJSON<Department>('/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateDepartment(id: string, updates: Partial<Department>): Promise<Department> {
    return fetchJSON<Department>(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteDepartment(id: string): Promise<{ message: string; id: string }> {
    return fetchJSON<{ message: string; id: string }>(`/departments/${id}`, {
      method: 'DELETE',
    });
  },

  // Services API
  async getServiceRequests(studentId?: string): Promise<ServiceRequest[]> {
    const query = studentId ? `?student_id=${encodeURIComponent(studentId)}` : '';
    return fetchJSON<ServiceRequest[]>(`/services${query}`);
  },

  async createServiceRequest(data: Partial<ServiceRequest>): Promise<ServiceRequest> {
    return fetchJSON<ServiceRequest>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateServiceRequestStatus(id: string, status: string): Promise<ServiceRequest> {
    return fetchJSON<ServiceRequest>(`/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Feedback API
  async getFeedback(): Promise<Feedback[]> {
    return fetchJSON<Feedback[]>('/feedback');
  },

  async getComplaintFeedback(complaintId: string): Promise<Feedback[]> {
    return fetchJSON<Feedback[]>(`/feedback/complaint/${complaintId}`);
  },

  async createFeedback(data: Partial<Feedback>): Promise<Feedback> {
    return fetchJSON<Feedback>('/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Notifications API
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    return fetchJSON<NotificationItem[]>(`/notifications/${userId}`);
  },

  async markNotificationRead(id: string): Promise<NotificationItem> {
    return fetchJSON<NotificationItem>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },
};
