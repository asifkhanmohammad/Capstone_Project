import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Complaint } from './models/Complaint.js';
import { Department } from './models/Department.js';
import { ServiceRequest } from './models/ServiceRequest.js';
import { Feedback } from './models/Feedback.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ccsm_db';

const seedDepartments = [
  { id: 'dept-1', name: 'Electrical & Power Maintenance', code: 'ELEC', headName: 'Dr. R. Vijay Krishna', headEmail: 'vijaykrishna.r@nriit.edu.in', staffCount: 8, activeComplaints: 3, slaTargetHours: 12 },
  { id: 'dept-2', name: 'Plumbing & Civil Infrastructure', code: 'PLUM', headName: 'Dr. G.L. Narayana', headEmail: 'narayana.gl@nriit.edu.in', staffCount: 6, activeComplaints: 2, slaTargetHours: 24 },
  { id: 'dept-3', name: 'IT Infrastructure & Campus Wi-Fi', code: 'ITINF', headName: 'Dr. K.V. Sambasiva Rao', headEmail: 'sambasivarao.kv@nriit.edu.in', staffCount: 12, activeComplaints: 5, slaTargetHours: 6 },
  { id: 'dept-4', name: 'Sanitation & Hygiene Services', code: 'CLEAN', headName: 'Prof. N.V. Surendra Babu', headEmail: 'surendrababu.nv@nriit.edu.in', staffCount: 10, activeComplaints: 1, slaTargetHours: 8 },
  { id: 'dept-5', name: 'Campus Transport & Fleet', code: 'TRANS', headName: 'Dr. P. Rama Koteswara Rao', headEmail: 'transport@nriit.edu.in', staffCount: 5, activeComplaints: 0, slaTargetHours: 24 },
];

const seedUsers = [
  { id: 'usr-student-1', name: 'Mohammad Asif Khan', email: 'asif.khan@student.nriit.edu.in', role: 'student', department: 'Computer Science & Engineering', phone: '+91 9876543210' },
  { id: 'usr-staff-1', name: 'K. Ramesh (Electrical Lead)', email: 'ramesh.elec@nriit.edu.in', role: 'staff', department: 'Electrical & Power Maintenance', phone: '+91 9876543211' },
  { id: 'usr-admin-1', name: 'Dr. Principal Admin', email: 'admin@nriit.edu.in', role: 'admin', department: 'Administration', phone: '+91 9876543212' },
];

const seedComplaints = [
  {
    id: 'CMP-2026-001',
    title: 'Ceiling Fan Not Working in CSE Lab-3',
    description: 'The overhead fan in Lab 3 Row B is completely unresponsive.',
    category: 'electrical',
    priority: 'high',
    status: 'in_progress',
    studentId: 'usr-student-1',
    studentName: 'Mohammad Asif Khan',
    location: 'Main Block 2nd Floor, Lab 3',
    assignedTo: 'usr-staff-1',
    assignedStaffName: 'K. Ramesh (Electrical Lead)',
    departmentId: 'dept-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueAt: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    upvotes: 4,
    timeline: [
      { id: 'tl-1', status: 'submitted', timestamp: new Date().toISOString(), updatedBy: 'Mohammad Asif Khan', note: 'Complaint submitted' },
      { id: 'tl-2', status: 'assigned', timestamp: new Date().toISOString(), updatedBy: 'Admin', note: 'Assigned to K. Ramesh' }
    ]
  },
  {
    id: 'CMP-2026-002',
    title: 'Wi-Fi Connection Dropping in Hostel Block B',
    description: 'Frequent disconnection on 3rd floor Wi-Fi Access Point AP-04.',
    category: 'internet_wifi',
    priority: 'medium',
    status: 'submitted',
    studentId: 'usr-student-1',
    studentName: 'Mohammad Asif Khan',
    location: 'Hostel Block B, Room 304',
    departmentId: 'dept-3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueAt: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    upvotes: 9,
    timeline: [
      { id: 'tl-3', status: 'submitted', timestamp: new Date().toISOString(), updatedBy: 'Mohammad Asif Khan', note: 'Submitted via portal' }
    ]
  }
];

const seedServices = [
  {
    id: 'SRV-2026-01',
    title: 'Bonafide Certificate Request',
    type: 'certificate',
    studentId: 'usr-student-1',
    studentName: 'Mohammad Asif Khan',
    status: 'in_progress',
    createdAt: new Date().toISOString(),
    details: 'Requested for bank education loan processing.'
  }
];

const seedFeedback = [
  {
    id: 'FB-01',
    complaintId: 'CMP-2026-001',
    studentId: 'usr-student-1',
    rating: 5,
    comment: 'Quick response time and professional maintenance service!',
    createdAt: new Date().toISOString()
  }
];

async function seedDatabase() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);

    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Complaint.deleteMany({});
    await Department.deleteMany({});
    await ServiceRequest.deleteMany({});
    await Feedback.deleteMany({});

    console.log('Inserting seed data into MongoDB...');
    await User.insertMany(seedUsers);
    await Department.insertMany(seedDepartments);
    await Complaint.insertMany(seedComplaints);
    await ServiceRequest.insertMany(seedServices);
    await Feedback.insertMany(seedFeedback);

    console.log('Successfully seeded MongoDB database `ccsm_db`!');
    console.log('Collections available in MongoDB Compass:');
    console.log(' - users');
    console.log(' - departments');
    console.log(' - complaints');
    console.log(' - servicerequests');
    console.log(' - feedbacks');

    process.exit(0);
  } catch (err) {
    console.error('Database seeding failed:', err);
    process.exit(1);
  }
}

seedDatabase();
