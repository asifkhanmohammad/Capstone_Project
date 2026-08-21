import { Complaint, Department, ServiceRequest, Feedback } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[Backend API] Endpoint ${endpoint} unreachable:`, err);
    return null;
  }
}

export const apiService = {
  async getComplaints(): Promise<Complaint[] | null> {
    return fetchJSON<Complaint[]>('/complaints');
  },

  async createComplaint(data: Partial<Complaint>): Promise<Complaint | null> {
    return fetchJSON<Complaint>('/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateComplaint(id: string, updates: Partial<Complaint>): Promise<Complaint | null> {
    return fetchJSON<Complaint>(`/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async getDepartments(): Promise<Department[] | null> {
    return fetchJSON<Department[]>('/departments');
  },

  async getServiceRequests(): Promise<ServiceRequest[] | null> {
    return fetchJSON<ServiceRequest[]>('/services');
  },

  async getFeedback(): Promise<Feedback[] | null> {
    return fetchJSON<Feedback[]>('/feedback');
  },
};
