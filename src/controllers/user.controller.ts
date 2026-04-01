import type { Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

export const userController = {
    async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw { status: 401, message: 'Unauthorized' };

            const user = await userService.getUserById(userId);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    },

    async getAllUsers(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    },

    async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) throw { status: 400, message: 'ID required' };
            const user = await userService.getUserById(id as string);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    },

    async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) throw { status: 400, message: 'ID required' };

            const user = await userService.updateUser(id as string, req.body);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    },

    async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) throw { status: 400, message: 'ID required' };
            const result = await userService.deleteUser(id as string);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
};
