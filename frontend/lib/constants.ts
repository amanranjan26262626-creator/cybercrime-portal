export const APP_NAME = 'Cybercrime Portal';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
export const POLYGON_RPC = process.env.NEXT_PUBLIC_POLYGON_RPC || '';

// Complaint Status
export enum ComplaintStatus {
  SUBMITTED = 'submitted',
  VERIFIED = 'verified',
  UNDER_INVESTIGATION = 'under_investigation',
  FIR_FILED = 'fir_filed',
  CLOSED = 'closed',
  REJECTED = 'rejected',
}

// Crime Types
export const CRIME_TYPES = [
  'Financial Theft',
  'Fraud Call',
  'OTP Scam',
  'Online Harassment',
  'Phishing',
  'Identity Theft',
  'Cyber Bullying',
  'Data Breach',
  'Ransomware',
  'Other',
];

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'video/mp4',
  'video/avi',
  'audio/mpeg',
  'audio/wav',
  'application/pdf',
];

// Languages
export const LANGUAGES = {
  HINDI: { code: 'hi', name: 'हिंदी' },
  SANTHALI: { code: 'sat', name: 'Santhali' },
  NAGPURI: { code: 'nag', name: 'Nagpuri' },
};

// Status Colors
export const STATUS_COLORS: Record<ComplaintStatus, string> = {
  [ComplaintStatus.SUBMITTED]: 'blue',
  [ComplaintStatus.VERIFIED]: 'green',
  [ComplaintStatus.UNDER_INVESTIGATION]: 'yellow',
  [ComplaintStatus.FIR_FILED]: 'purple',
  [ComplaintStatus.CLOSED]: 'gray',
  [ComplaintStatus.REJECTED]: 'red',
};

