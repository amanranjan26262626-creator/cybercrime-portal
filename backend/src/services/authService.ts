import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel, User, UserRole } from '../models/User';
import { generateComplaintNumber } from '../utils/helpers';
import logger from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret';

export interface RegisterData {
  email: string;
  phone: string;
  name: string;
  password: string;
  role?: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    // Check if user exists
    const existingUser = await UserModel.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await UserModel.create({
      email: data.email,
      phone: data.phone,
      name: data.name,
      password_hash: passwordHash,
      role: data.role || UserRole.CITIZEN,
      is_verified: false,
      is_active: true,
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    logger.info('User registered', { userId: user.id, email: user.email });
    return { user, token };
  },

  async login(data: LoginData): Promise<{ user: User; token: string }> {
    // Find user
    const user = await UserModel.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isValid = await bcrypt.compare(data.password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    logger.info('User logged in', { userId: user.id, email: user.email });
    return { user, token };
  },

  async refreshToken(token: string): Promise<string> {
    try {
      const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as any;
      const user = await UserModel.findById(decoded.id);
      
      if (!user || !user.is_active) {
        throw new Error('Invalid token');
      }

      const newToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return newToken;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  },

  async verifyEmail(userId: string): Promise<void> {
    await UserModel.update(userId, { is_verified: true });
    logger.info('Email verified', { userId });
  },
};

