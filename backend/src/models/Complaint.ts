import { Pool } from 'pg';
import { pgPool } from '../config/database';

export enum ComplaintStatus {
  SUBMITTED = 'submitted',
  VERIFIED = 'verified',
  UNDER_INVESTIGATION = 'under_investigation',
  FIR_FILED = 'fir_filed',
  CLOSED = 'closed',
  REJECTED = 'rejected',
}

export interface Complaint {
  id: string;
  complaint_number: string;
  user_id: string;
  crime_type: string;
  description: string;
  amount: number | null;
  location: any; // JSONB
  status: ComplaintStatus;
  severity_score: number;
  ipfs_hash: string;
  blockchain_tx_hash: string | null;
  assigned_to: string | null;
  verified_by: string | null;
  fir_number: string | null;
  created_at: Date;
  updated_at: Date;
}

export class ComplaintModel {
  static async create(complaintData: Omit<Complaint, 'id' | 'created_at' | 'updated_at'>): Promise<Complaint> {
    const query = `
      INSERT INTO complaints (
        complaint_number, user_id, crime_type, description, amount, location,
        status, severity_score, ipfs_hash, blockchain_tx_hash
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      complaintData.complaint_number,
      complaintData.user_id,
      complaintData.crime_type,
      complaintData.description,
      complaintData.amount,
      JSON.stringify(complaintData.location),
      complaintData.status,
      complaintData.severity_score,
      complaintData.ipfs_hash,
      complaintData.blockchain_tx_hash,
    ];
    const result = await pgPool.query(query, values);
    return result.rows[0];
  }

  static async findById(id: string): Promise<Complaint | null> {
    const query = 'SELECT * FROM complaints WHERE id = $1';
    const result = await pgPool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findByUserId(userId: string): Promise<Complaint[]> {
    const query = 'SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pgPool.query(query, [userId]);
    return result.rows;
  }

  static async findAll(filters?: {
    status?: ComplaintStatus;
    severity?: number;
    assigned_to?: string;
  }): Promise<Complaint[]> {
    let query = 'SELECT * FROM complaints WHERE 1=1';
    const values: any[] = [];
    let paramCount = 1;

    if (filters?.status) {
      query += ` AND status = $${paramCount++}`;
      values.push(filters.status);
    }
    if (filters?.severity) {
      query += ` AND severity_score >= $${paramCount++}`;
      values.push(filters.severity);
    }
    if (filters?.assigned_to) {
      query += ` AND assigned_to = $${paramCount++}`;
      values.push(filters.assigned_to);
    }

    query += ' ORDER BY created_at DESC';
    const result = await pgPool.query(query, values);
    return result.rows;
  }

  static async update(id: string, updates: Partial<Complaint>): Promise<Complaint> {
    const fields = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'created_at')
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = [id, ...Object.values(updates)];
    const query = `UPDATE complaints SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`;
    const result = await pgPool.query(query, values);
    return result.rows[0];
  }
}

