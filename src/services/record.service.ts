import prisma from '../utils/prisma';
import { z } from 'zod';

export const recordSchema = z.object({
    amount: z.number().positive(),
    type: z.enum(['INCOME', 'EXPENSE']),
    category: z.string().min(1),
    date: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: 'Invalid date format (ISO strings or valid date required)',
    }),
    description: z.string().optional(),
});

export const updateRecordSchema = recordSchema.partial();

export const querySchema = z.object({
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

export const recordService = {
    async createRecord(userId: string, data: z.infer<typeof recordSchema>) {
        return prisma.financialRecord.create({
            data: {
                ...data,
                date: new Date(data.date),
                userId,
            },
        });
    },

    async getAllRecords(userId: string, role: string, query: z.infer<typeof querySchema>) {
        const where: any = {};

        // Only allow Admin/Analyst to view all if requested, or filter by userId
        // Actually, for this system, we'll assume Viewer/Analyst/Admin sees their own or all?
        // User role check is handled by controller usually, but logic here:
        if (role !== 'ADMIN') {
            where.userId = userId;
        }

        if (query.type) where.type = query.type;
        if (query.category) where.category = query.category;
        if (query.startDate || query.endDate) {
            where.date = {
                ...(query.startDate && { gte: new Date(query.startDate) }),
                ...(query.endDate && { lte: new Date(query.endDate) }),
            };
        }

        return prisma.financialRecord.findMany({
            where,
            orderBy: { date: 'desc' },
            include: { user: { select: { name: true, email: true } } },
        });
    },

    async getRecordById(id: string, userId: string, role: string) {
        const record = await prisma.financialRecord.findUnique({
            where: { id },
            include: { user: { select: { name: true, email: true } } },
        });

        if (!record) throw { status: 404, message: 'Record not found' };

        // Viewer/Analyst see their own unless they are admin? Let's say Admin see everything
        if (role !== 'ADMIN' && record.userId !== userId) {
            throw { status: 403, message: 'Forbidden' };
        }

        return record;
    },

    async updateRecord(id: string, userId: string, role: string, data: z.infer<typeof updateRecordSchema>) {
        const record = await this.getRecordById(id, userId, role);

        // Only Admin can update everything, others only their own
        // getRecordById already handles some check, but let's be explicit
        if (role !== 'ADMIN' && record.userId !== userId) {
            throw { status: 403, message: 'Forbidden' };
        }

        return prisma.financialRecord.update({
            where: { id },
            data: {
                ...data,
                date: data.date ? new Date(data.date) : undefined,
            },
        });
    },

    async deleteRecord(id: string, userId: string, role: string) {
        const record = await this.getRecordById(id, userId, role);

        if (role !== 'ADMIN' && record.userId !== userId) {
            throw { status: 403, message: 'Forbidden' };
        }

        await prisma.financialRecord.delete({ where: { id } });
        return { success: true };
    },
};
