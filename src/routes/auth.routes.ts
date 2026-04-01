import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { signupSchema, loginSchema } from '../services/auth.service.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);

export default router;
