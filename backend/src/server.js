import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import complaintRoutes from './routes/complaintRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Campus Complaint & Service Management Backend',
    database: 'MongoDB',
    timestamp: new Date().toISOString(),
  });
});

// Connect Database & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Express API] Server running at http://localhost:${PORT}`);
  });
});
