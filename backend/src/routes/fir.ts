import { Router } from 'express';
import { firController } from '../controllers/firController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleCheck';

const router = Router();

router.use(authenticate);
router.use(requireRole('police', 'admin')); // Only police and admin can access FIR routes

router.post('/generate', firController.generate);
router.get('/:firNumber', firController.getByNumber);
router.get('/complaint/:complaintId', firController.getByComplaint);

export default router;

