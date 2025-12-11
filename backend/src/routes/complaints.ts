import { Router } from 'express';
import { complaintController } from '../controllers/complaintController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', upload.array('evidence', 10), complaintController.create);
router.get('/', complaintController.getAll);
router.get('/:id', complaintController.getById);

export default router;

