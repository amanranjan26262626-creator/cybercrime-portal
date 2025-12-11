import { Pool } from 'pg';
import { pgPool } from '../config/database';

export enum UserRole {
  CITIZEN = 'citizen',
  POLICE = 'police',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  password_hash: string;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const query = `
      INSERT INTO users (email, phone, name, password_hash, role, is_verified, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      userData.email,
      userData.phone,
      userData.name,
      userData.password_hash,
      userData.role,
      userData.is_verified || false,
      userData.is_active !== undefined ? userData.is_active : true,
    ];
    const result = await pgPool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pgPool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pgPool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async update(id: string, updates: Partial<User>): Promise<User> {
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [id, ...Object.values(updates)];
    const query = `UPDATE users SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`;
    const result = await pgPool.query(query, values);
    return result.rows[0];
  }
}

