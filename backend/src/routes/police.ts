import { Router } from 'express';
import { policeController } from '../controllers/policeController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleCheck';

const router = Router();

router.use(authenticate);
router.use(requireRole('police', 'admin')); // Only police and admin can access

router.get('/complaints', policeController.getAllComplaints);
router.get('/complaints/pending', policeController.getPendingComplaints);
router.get('/complaints/assigned', policeController.getAssignedComplaints);
router.get('/complaints/:id', policeController.getComplaintById);
router.put('/complaints/:id/status', policeController.updateStatus);
router.post('/complaints/:id/assign', policeController.assignComplaint);

export default router;

