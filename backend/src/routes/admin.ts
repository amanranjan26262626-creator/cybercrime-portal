import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleCheck';

const router = Router();

router.use(authenticate);
router.use(requireRole('admin', 'super_admin')); // Only admin can access

router.get('/users', adminController.getAllUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deactivateUser);
router.get('/complaints', adminController.getAllComplaints);
router.get('/analytics', adminController.getAnalytics);

export default router;

