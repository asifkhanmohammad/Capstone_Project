import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/ccsm_db';
    const conn = await mongoose.connect(connStr);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Critical Connection Failure: ${error.message}`);
    console.error('[MongoDB] Ensure local MongoDB service is running or MONGODB_URI is properly configured.');
    return null;
  }
};
