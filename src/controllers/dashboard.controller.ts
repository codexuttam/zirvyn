import { Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export const dashboardController = {
    async getSummary(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId, role } = req.user!;
            const data = await dashboardService.getSummary(userId, role);
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    },
};
