import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/ccsm_db';
    const conn = await mongoose.connect(connStr);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection Error: ${error.message}`);
    // Non-fatal fallback warning if MongoDB is not running locally
    console.warn('[MongoDB] Please ensure MongoDB service is running locally or MONGODB_URI points to a valid cluster.');
  }
};
