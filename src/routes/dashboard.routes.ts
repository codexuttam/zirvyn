import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authMiddleware);

// All roles can view dashboard data
router.get('/summary', roleMiddleware('VIEWER', 'ANALYST', 'ADMIN'), dashboardController.getSummary);

export default router;
