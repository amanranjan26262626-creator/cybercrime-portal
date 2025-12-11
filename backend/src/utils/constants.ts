export const APP_NAME = 'Cybercrime Portal';
export const APP_VERSION = '1.0.0';

// Complaint Status
export enum ComplaintStatus {
  SUBMITTED = 'submitted',
  VERIFIED = 'verified',
  UNDER_INVESTIGATION = 'under_investigation',
  FIR_FILED = 'fir_filed',
  CLOSED = 'closed',
  REJECTED = 'rejected',
}

// User Roles
export enum UserRole {
  CITIZEN = 'citizen',
  POLICE = 'police',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
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

// File Upload Limits
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

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Severity Score Ranges
export const SEVERITY_RANGES = {
  LOW: { min: 0, max: 30 },
  MEDIUM: { min: 31, max: 60 },
  HIGH: { min: 61, max: 80 },
  CRITICAL: { min: 81, max: 100 },
};

// Languages
export const SUPPORTED_LANGUAGES = {
  HINDI: 'hi',
  SANTHALI: 'sat',
  NAGPURI: 'nag',
};

// FIR Number Format
export const FIR_NUMBER_FORMAT = 'JH/{STATION}/{YEAR}/{NUMBER}';

// API Response Messages
export const MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'An error occurred',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  VALIDATION_ERROR: 'Validation failed',
};

