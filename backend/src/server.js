import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import complaintRoutes from './routes/complaintRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import authRoutes from './routes/authRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint (Requirement #18)
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  if (isConnected) {
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      service: 'Campus Complaint & Service Management Backend',
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      service: 'Campus Complaint & Service Management Backend',
      timestamp: new Date().toISOString(),
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);

// Connect Database & Start Server
connectDB()
  .then((conn) => {
    if (conn) {
      app.listen(PORT, () => {
        console.log(`[Express API] Server running at http://localhost:${PORT}`);
        console.log(`[Express API] MongoDB Database: ccsm_db connected`);
      });
    } else {
      console.error('[Fatal] Backend server will NOT start because MongoDB connection failed.');
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('[Fatal] Database connection error:', err.message);
    process.exit(1);
  });
