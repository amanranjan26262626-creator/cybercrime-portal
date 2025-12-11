import { Pool } from 'pg';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL connection
export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pgPool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

// MongoDB connection
export const connectMongoDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test database connections
export const testConnections = async () => {
  try {
    // Test PostgreSQL
    const pgResult = await pgPool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected:', pgResult.rows[0].now);
    
    // Test MongoDB
    await connectMongoDB();
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    throw error;
  }
};

