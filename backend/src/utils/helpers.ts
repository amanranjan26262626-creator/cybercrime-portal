import { v4 as uuidv4 } from 'uuid';

export const generateComplaintNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `CC-${timestamp}-${random}`;
};

export const generateFIRNumber = (stationCode: string): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000);
  return `JH/${stationCode}/${year}/${random}`;
};

export const generateUUID = (): string => {
  return uuidv4();
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatDateTime = (date: Date): string => {
  return date.toISOString();
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

