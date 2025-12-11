import admin from 'firebase-admin';
import { IPFS_CONFIG } from '../config/ipfs';
import logger from '../utils/logger';

let firebaseApp: admin.app.App | null = null;

export const initializeFirebase = () => {
  if (!firebaseApp) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccount) {
      logger.warn('Firebase credentials not found, Firebase storage disabled');
      return;
    }

    try {
      const serviceAccountJson = JSON.parse(serviceAccount);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountJson),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
      logger.info('Firebase initialized successfully');
    } catch (error: any) {
      logger.error('Firebase initialization failed', { error: error.message });
    }
  }
};

export const firebaseService = {
  async uploadFile(fileBuffer: Buffer, fileName: string, path?: string): Promise<string> {
    if (!firebaseApp) {
      throw new Error('Firebase not initialized');
    }

    try {
      const bucket = admin.storage().bucket();
      const filePath = path ? `${path}/${fileName}` : fileName;
      const file = bucket.file(filePath);

      await file.save(fileBuffer, {
        metadata: {
          contentType: 'application/octet-stream',
        },
      });

      // Make file publicly accessible
      await file.makePublic();

      const url = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
      logger.info('File uploaded to Firebase', { fileName, url });
      return url;
    } catch (error: any) {
      logger.error('Firebase upload failed', { error: error.message });
      throw error;
    }
  },

  async uploadToBoth(fileBuffer: Buffer, fileName: string): Promise<{ ipfs: string; firebase: string }> {
    // Upload to both IPFS and Firebase
    const [ipfsHash, firebaseUrl] = await Promise.all([
      // IPFS upload (existing)
      import('./ipfsService').then(({ ipfsService }) =>
        ipfsService.uploadFile(fileBuffer, fileName)
      ),
      // Firebase upload
      this.uploadFile(fileBuffer, fileName),
    ]);

    return { ipfs: ipfsHash, firebase: firebaseUrl };
  },
};

