import type { Response, NextFunction } from 'express';
import { recordService, recordSchema, updateRecordSchema, querySchema } from '../services/record.service.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

export const recordController = {
    async createRecord(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw { status: 401, message: 'Unauthorized' };

            const data = recordSchema.parse(req.body);
            const record = await recordService.createRecord(userId, data);
            res.status(201).json(record);
        } catch (error) {
            next(error);
        }
    },

    async getAllRecords(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const role = req.user?.role;
            if (!userId || !role) throw { status: 401, message: 'Unauthorized' };

            const query = querySchema.parse(req.query);
            const records = await recordService.getAllRecords(userId, role, query);
            res.status(200).json(records);
        } catch (error) {
            next(error);
        }
    },

    async getRecordById(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const role = req.user?.role;
            const { id } = req.params;
            if (!userId || !role) throw { status: 401, message: 'Unauthorized' };
            if (!id) throw { status: 400, message: 'ID required' };

            const record = await recordService.getRecordById(id as string, userId, role);
            res.status(200).json(record);
        } catch (error) {
            next(error);
        }
    },

    async updateRecord(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const role = req.user?.role;
            const { id } = req.params;
            if (!userId || !role) throw { status: 401, message: 'Unauthorized' };
            if (!id) throw { status: 400, message: 'ID required' };

            const data = updateRecordSchema.parse(req.body);
            const record = await recordService.updateRecord(id as string, userId, role, data);
            res.status(200).json(record);
        } catch (error) {
            next(error);
        }
    },

    async deleteRecord(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const role = req.user?.role;
            const { id } = req.params;
            if (!userId || !role) throw { status: 401, message: 'Unauthorized' };
            if (!id) throw { status: 400, message: 'ID required' };

            const result = await recordService.deleteRecord(id as string, userId, role);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
};
