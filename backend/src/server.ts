import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectMongoDB, testConnections } from './config/database';
import { initializeFirebase } from './services/firebaseService';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Cybercrime Portal API is running' });
});

// Routes
import authRoutes from './routes/auth';
import complaintRoutes from './routes/complaints';
import policeRoutes from './routes/police';
import chatbotRoutes from './routes/chatbot';
import firRoutes from './routes/fir';
import adminRoutes from './routes/admin';

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/police', policeRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/fir', firRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Initialize database connections and start server
async function startServer() {
  try {
    // Test database connections
    await testConnections();
    
    // Initialize Firebase
    initializeFirebase();
    
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`✅ All services initialized`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
