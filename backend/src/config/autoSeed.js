import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { Complaint } from '../models/Complaint.js';
import { ServiceRequest } from '../models/ServiceRequest.js';
import { Feedback } from '../models/Feedback.js';
import { Notification } from '../models/Notification.js';

const seedDepartments = [
  {
    id: 'dept-1',
    name: 'Electrical & Power Maintenance',
    code: 'ELEC',
    head_name: 'Dr. R. Vijay Krishna',
    head_email: 'vijaykrishna.r@nriit.edu.in',
    staff_count: 8,
    active_complaints: 3,
    sla_target_hours: 12,
    monthly_budget: 65000,
    created_at: new Date().toISOString(),
  },
  {
    id: 'dept-2',
    name: 'Plumbing & Civil Infrastructure',
    code: 'PLUM',
    head_name: 'Dr. G.L. Narayana',
    head_email: 'narayana.gl@nriit.edu.in',
    staff_count: 6,
    active_complaints: 2,
    sla_target_hours: 24,
    monthly_budget: 45000,
    created_at: new Date().toISOString(),
  },
  {
    id: 'dept-3',
    name: 'IT Infrastructure & Campus Wi-Fi',
    code: 'ITINF',
    head_name: 'Dr. K.V. Sambasiva Rao',
    head_email: 'sambasivarao.kv@nriit.edu.in',
    staff_count: 12,
    active_complaints: 5,
    sla_target_hours: 6,
    monthly_budget: 120000,
    created_at: new Date().toISOString(),
  },
  {
    id: 'dept-4',
    name: 'Sanitation & Hygiene Services',
    code: 'CLEAN',
    head_name: 'Prof. N.V. Surendra Babu',
    head_email: 'surendrababu.nv@nriit.edu.in',
    staff_count: 10,
    active_complaints: 1,
    sla_target_hours: 8,
    monthly_budget: 35000,
    created_at: new Date().toISOString(),
  },
  {
    id: 'dept-5',
    name: 'Campus Transport & Fleet',
    code: 'TRANS',
    head_name: 'Dr. P. Rama Koteswara Rao',
    head_email: 'transport@nriit.edu.in',
    staff_count: 5,
    active_complaints: 0,
    sla_target_hours: 24,
    monthly_budget: 80000,
    created_at: new Date().toISOString(),
  },
];

const seedUsers = [
  {
    id: 'usr-student-1',
    name: 'Mohammad Asif Khan',
    full_name: 'Mohammad Asif Khan',
    email: 'asif.khan@student.nriit.edu.in',
    password: 'student123456',
    role: 'student',
    department: 'Computer Science & Engineering',
    department_id: 'dept-3',
    department_name: 'IT Infrastructure & Campus Wi-Fi',
    phone: '+91 98765 43210',
    student_id_number: '217W1A0501',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'usr-staff-1',
    name: 'Sri Ch. Satyanarayana (Senior Electrical Lead)',
    full_name: 'Sri Ch. Satyanarayana (Senior Electrical Lead)',
    email: 'ramesh.elec@nriit.edu.in',
    password: 'faculty123456',
    role: 'staff',
    department: 'Electrical & Power Maintenance',
    department_id: 'dept-1',
    department_name: 'Electrical & Power Maintenance',
    phone: '+91 98765 43211',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'usr-admin-1',
    name: 'Dr. K.V. Sambasiva Rao (HOD, CSE)',
    full_name: 'Dr. K.V. Sambasiva Rao (HOD, CSE)',
    email: 'admin@nriit.edu.in',
    password: 'admin123456',
    role: 'admin',
    department: 'IT Infrastructure & Campus Wi-Fi',
    department_id: 'dept-3',
    department_name: 'IT Infrastructure & Campus Wi-Fi',
    phone: '+91 94401 23456',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'usr-superadmin-1',
    name: 'Dr. C. Naga Bhaskar (Principal & Campus Director)',
    full_name: 'Dr. C. Naga Bhaskar (Principal & Campus Director)',
    email: 'principal@nriit.edu.in',
    password: 'admin123456',
    role: 'super_admin',
    department: 'College Administration & Governance',
    phone: '+91 94400 11223',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    created_at: new Date().toISOString(),
  },
];

const seedComplaints = [
  {
    id: 'cmp-1001',
    complaint_number: 'CMP-2026-0001',
    title: 'Ceiling Fan Not Working in CSE Lab-3',
    description: 'The overhead fan in Lab 3 Row B is completely unresponsive causing high heat.',
    category: 'electrical',
    priority: 'high',
    status: 'in_progress',
    student_id: 'usr-student-1',
    student_name: 'Mohammad Asif Khan',
    student_email: 'asif.khan@student.nriit.edu.in',
    location: 'Main Block 2nd Floor, Lab 3',
    assigned_staff_id: 'usr-staff-1',
    assigned_staff_name: 'K. Ramesh (Electrical Lead)',
    department_id: 'dept-1',
    department_name: 'Electrical & Power Maintenance',
    evidence_urls: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop'],
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
    due_at: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    upvotes: 4,
    timeline: [
      {
        id: 'tl-1',
        complaint_id: 'cmp-1001',
        user_id: 'usr-student-1',
        user_name: 'Mohammad Asif Khan',
        user_role: 'student',
        new_status: 'submitted',
        comment: 'Complaint registered via portal',
        is_internal: false,
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'tl-2',
        complaint_id: 'cmp-1001',
        user_id: 'usr-admin-1',
        user_name: 'Dr. Principal Admin',
        user_role: 'admin',
        old_status: 'submitted',
        new_status: 'in_progress',
        comment: 'Assigned ticket to K. Ramesh (Electrical Lead)',
        is_internal: false,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
  },
  {
    id: 'cmp-1002',
    complaint_number: 'CMP-2026-0002',
    title: 'Wi-Fi Connection Dropping in Hostel Block B',
    description: 'Frequent disconnection on 3rd floor Wi-Fi Access Point AP-04.',
    category: 'internet_wifi',
    priority: 'medium',
    status: 'submitted',
    student_id: 'usr-student-1',
    student_name: 'Mohammad Asif Khan',
    student_email: 'asif.khan@student.nriit.edu.in',
    location: 'Hostel Block B, Room 304',
    department_id: 'dept-3',
    department_name: 'IT Infrastructure & Campus Wi-Fi',
    evidence_urls: [],
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    due_at: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    upvotes: 9,
    timeline: [
      {
        id: 'tl-3',
        complaint_id: 'cmp-1002',
        user_id: 'usr-student-1',
        user_name: 'Mohammad Asif Khan',
        user_role: 'student',
        new_status: 'submitted',
        comment: 'Submitted via portal',
        is_internal: false,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
  },
];

const seedServices = [
  {
    id: 'srv-101',
    student_id: 'usr-student-1',
    student_name: 'Mohammad Asif Khan',
    service_type: 'Bonafide Certificate',
    location: 'Administrative Office Counter 2',
    description: 'Requested for bank education loan processing.',
    preferred_slot: 'Morning (10:00 AM - 12:00 PM)',
    status: 'scheduled',
    created_at: new Date().toISOString(),
  },
];

const seedFeedback = [
  {
    id: 'fb-201',
    complaint_id: 'cmp-1001',
    student_id: 'usr-student-1',
    rating: 5,
    comments: 'Quick response time and professional maintenance service!',
    is_satisfied: true,
    created_at: new Date().toISOString(),
  },
];

const seedNotifications = [
  {
    id: 'notif-1',
    user_id: 'usr-student-1',
    title: 'Complaint Assigned',
    message: 'Your complaint CMP-2026-0001 has been assigned to K. Ramesh.',
    link: '/complaints/cmp-1001',
    type: 'info',
    is_read: false,
    created_at: new Date().toISOString(),
  },
];

export async function autoSeedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[AutoSeed] Database is empty. Seeding initial original dataset into MongoDB...');
      await User.insertMany(seedUsers);
      await Department.insertMany(seedDepartments);
      await Complaint.insertMany(seedComplaints);
      await ServiceRequest.insertMany(seedServices);
      await Feedback.insertMany(seedFeedback);
      await Notification.insertMany(seedNotifications);
      console.log('[AutoSeed] MongoDB auto-seeding completed successfully.');
    } else {
      console.log('[AutoSeed] MongoDB contains existing data. Skipping seed.');
    }
  } catch (err) {
    console.error('[AutoSeed] Error during automatic database seeding:', err.message);
  }
}
