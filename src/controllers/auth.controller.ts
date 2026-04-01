import { Request, Response, NextFunction } from 'express';
import { authService, loginSchema, signupSchema } from '../services/auth.service';

export const authController = {
    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = signupSchema.parse(req.body);
            const result = await authService.signup(validatedData);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = loginSchema.parse(req.body);
            const result = await authService.login(validatedData);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
};
