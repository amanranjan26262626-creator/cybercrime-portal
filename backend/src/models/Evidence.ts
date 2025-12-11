import { pgPool } from '../config/database';

export interface Evidence {
  id: string;
  complaint_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  ipfs_hash: string;
  uploaded_at: Date;
  verified: boolean;
}

export class EvidenceModel {
  static async create(evidenceData: Omit<Evidence, 'id' | 'uploaded_at'>): Promise<Evidence> {
    const query = `
      INSERT INTO evidence (complaint_id, file_name, file_type, file_size, ipfs_hash, verified)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      evidenceData.complaint_id,
      evidenceData.file_name,
      evidenceData.file_type,
      evidenceData.file_size,
      evidenceData.ipfs_hash,
      evidenceData.verified || false,
    ];
    const result = await pgPool.query(query, values);
    return result.rows[0];
  }

  static async findByComplaintId(complaintId: string): Promise<Evidence[]> {
    const query = 'SELECT * FROM evidence WHERE complaint_id = $1 ORDER BY uploaded_at DESC';
    const result = await pgPool.query(query, [complaintId]);
    return result.rows;
  }

  static async verify(id: string): Promise<Evidence> {
    const query = 'UPDATE evidence SET verified = true WHERE id = $1 RETURNING *';
    const result = await pgPool.query(query, [id]);
    return result.rows[0];
  }
}

