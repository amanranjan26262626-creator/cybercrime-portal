import { pgPool } from '../config/database';

export interface PoliceUser {
  id: string;
  user_id: string;
  badge_number: string;
  station: string;
  rank: string;
  department: string;
  jurisdiction: any; // JSONB
  is_active: boolean;
}

export class PoliceUserModel {
  static async create(policeData: Omit<PoliceUser, 'id'>): Promise<PoliceUser> {
    const query = `
      INSERT INTO police_users (user_id, badge_number, station, rank, department, jurisdiction, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      policeData.user_id,
      policeData.badge_number,
      policeData.station,
      policeData.rank,
      policeData.department,
      JSON.stringify(policeData.jurisdiction),
      policeData.is_active !== undefined ? policeData.is_active : true,
    ];
    const result = await pgPool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId: string): Promise<PoliceUser | null> {
    const query = 'SELECT * FROM police_users WHERE user_id = $1';
    const result = await pgPool.query(query, [userId]);
    return result.rows[0] || null;
  }

  static async findByBadgeNumber(badgeNumber: string): Promise<PoliceUser | null> {
    const query = 'SELECT * FROM police_users WHERE badge_number = $1';
    const result = await pgPool.query(query, [badgeNumber]);
    return result.rows[0] || null;
  }

  static async findAll(): Promise<PoliceUser[]> {
    const query = 'SELECT * FROM police_users WHERE is_active = true ORDER BY station, rank';
    const result = await pgPool.query(query);
    return result.rows;
  }
}

