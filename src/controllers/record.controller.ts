import { Response, NextFunction } from 'express';
import { recordService, recordSchema, updateRecordSchema, querySchema } from '../services/record.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const recordController = {
    async createRecord(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.user!;
            const data = recordSchema.parse(req.body);
            const record = await recordService.createRecord(userId, data);
            res.status(201).json(record);
        } catch (error) {
            next(error);
        }
    },

    async getAllRecords(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId, role } = req.user!;
            const query = querySchema.parse(req.query);
            const records = await recordService.getAllRecords(userId, role, query);
            res.status(200).json(records);
        } catch (error) {
            next(error);
        }
    },

    async getRecordById(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId, role } = req.user!;
            const { id } = req.params;
            if (!id) throw { status: 400, message: 'ID required' };
            const record = await recordService.getRecordById(id as string, userId, role);
            res.status(200).json(record);
        } catch (error) {
            next(error);
        }
    },

    async updateRecord(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId, role } = req.user!;
            const { id } = req.params;
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
            const { id: userId, role } = req.user!;
            const { id } = req.params;
            if (!id) throw { status: 400, message: 'ID required' };
            const result = await recordService.deleteRecord(id as string, userId, role);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
};
