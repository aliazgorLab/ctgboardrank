import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows / ISP DNS blocking MongoDB SRV queries (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  console.warn('Failed to set custom DNS servers:', err.message);
}

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ctgboardrank';
    const conn = await mongoose.connect(mongoUri, { dbName: 'ctgboardrank' });
    console.log(`MongoDB Connected: ${conn.connection.host} [dbName: ctgboardrank]`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};
