import { CRIME_TYPES, SEVERITY_RANGES } from '../utils/constants';

interface ComplaintData {
  crime_type: string;
  amount?: number | null;
  has_video?: boolean;
  has_audio?: boolean;
  has_screenshots?: boolean;
  is_ongoing?: boolean;
  hours_ago?: number;
}

export const severityService = {
  calculateSeverity(data: ComplaintData): number {
    let score = 0;

    // Financial impact (0-40 points)
    if (data.amount) {
      if (data.amount > 100000) {
        score += 40;
      } else if (data.amount > 50000) {
        score += 30;
      } else if (data.amount > 10000) {
        score += 20;
      } else {
        score += 10;
      }
    } else {
      score += 5; // No financial impact
    }

    // Crime type weight (0-30 points)
    const crimeWeights: Record<string, number> = {
      'Financial Theft': 30,
      'Ransomware': 30,
      'Identity Theft': 25,
      'Online Harassment': 25,
      'Fraud Call': 20,
      'OTP Scam': 20,
      'Phishing': 15,
      'Cyber Bullying': 15,
      'Data Breach': 25,
      'Other': 10,
    };
    score += crimeWeights[data.crime_type] || 10;

    // Evidence quality (0-20 points)
    if (data.has_video) {
      score += 20;
    } else if (data.has_audio) {
      score += 15;
    } else if (data.has_screenshots) {
      score += 10;
    } else {
      score += 5;
    }

    // Urgency factor (0-10 points)
    if (data.is_ongoing) {
      score += 10;
    } else if (data.hours_ago && data.hours_ago < 24) {
      score += 7;
    } else {
      score += 3;
    }

    return Math.min(score, 100); // Cap at 100
  },

  getSeverityLevel(score: number): string {
    if (score >= SEVERITY_RANGES.CRITICAL.min) return 'critical';
    if (score >= SEVERITY_RANGES.HIGH.min) return 'high';
    if (score >= SEVERITY_RANGES.MEDIUM.min) return 'medium';
    return 'low';
  },

  getPriority(score: number): number {
    // Higher score = higher priority (1-5)
    if (score >= 80) return 1; // Critical
    if (score >= 60) return 2; // High
    if (score >= 40) return 3; // Medium
    if (score >= 20) return 4; // Low
    return 5; // Very Low
  },
};

