import { Router } from 'express';
import { recordController } from '../controllers/record.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authMiddleware);

// Analyst and Admin can view records
router.get('/', roleMiddleware('ANALYST', 'ADMIN'), recordController.getAllRecords);
router.get('/:id', roleMiddleware('ANALYST', 'ADMIN'), recordController.getRecordById);

// Only Admin can manage records (Create, Update, Delete)
router.post('/', roleMiddleware('ADMIN'), recordController.createRecord);
router.patch('/:id', roleMiddleware('ADMIN'), recordController.updateRecord);
router.delete('/:id', roleMiddleware('ADMIN'), recordController.deleteRecord);

export default router;
