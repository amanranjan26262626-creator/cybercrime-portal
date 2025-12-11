import { pgPool } from '../config/database';

export interface FIR {
  id: string;
  complaint_id: string;
  fir_number: string;
  filed_at: Date;
  filed_by: string;
  station_code: string;
  status: string;
  pdf_path: string | null;
}

export class FIRModel {
  static async create(firData: Omit<FIR, 'id' | 'filed_at'>): Promise<FIR> {
    const query = `
      INSERT INTO fir_records (complaint_id, fir_number, filed_by, station_code, status, pdf_path)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      firData.complaint_id,
      firData.fir_number,
      firData.filed_by,
      firData.station_code,
      firData.status,
      firData.pdf_path,
    ];
    const result = await pgPool.query(query, values);
    return result.rows[0];
  }

  static async findByFIRNumber(firNumber: string): Promise<FIR | null> {
    const query = 'SELECT * FROM fir_records WHERE fir_number = $1';
    const result = await pgPool.query(query, [firNumber]);
    return result.rows[0] || null;
  }

  static async findByComplaintId(complaintId: string): Promise<FIR | null> {
    const query = 'SELECT * FROM fir_records WHERE complaint_id = $1';
    const result = await pgPool.query(query, [complaintId]);
    return result.rows[0] || null;
  }
}

