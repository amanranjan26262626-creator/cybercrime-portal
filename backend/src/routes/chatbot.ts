import { Router } from 'express';
import { chatbotController } from '../controllers/chatbotController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/message', chatbotController.sendMessage);
router.get('/conversation/:complaintId', chatbotController.getConversation);

export default router;

