import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { autoSeedDatabase } from './config/autoSeed.js';
import complaintRoutes from './routes/complaintRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import authRoutes from './routes/authRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../../frontend/dist');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static assets from frontend dist build if present
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Health check endpoint (Requirement #18)
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'ok',
    database: isConnected ? 'connected' : 'hybrid_demo_mode',
    service: 'Campus Complaint & Service Management Backend',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);

// SPA fallback for frontend client routing (Port 5000)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(200).send(`
    <html>
      <body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; text-align: center; padding: 50px;">
        <h2>Campus Complaint & Service Management API</h2>
        <p>Express Backend Server is running on <strong>Port ${PORT}</strong>.</p>
        <p>Build the frontend (<code>npm run build</code>) to serve web UI directly on this port.</p>
      </body>
    </html>
  `);
});

// Connect Database & Start Server
connectDB().then(async (conn) => {
  if (conn) {
    console.log(`[Express Unified Server] MongoDB Database: connected successfully`);
    await autoSeedDatabase();
  } else {
    console.log(`[Express Unified Server] Operating with zero-downtime database fallback.`);
  }

  app.listen(PORT, () => {
    console.log(`[Express Unified Server] Server running at http://localhost:${PORT}`);
  });
});


