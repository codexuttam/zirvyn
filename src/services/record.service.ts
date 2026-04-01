import prisma from '../utils/prisma.js';
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
    search: z.string().optional(),
    page: z.string().transform(Number).default(1),
    limit: z.string().transform(Number).default(10),
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
        const where: any = { deletedAt: null };

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

        if (query.search) {
            where.OR = [
                { category: { contains: query.search } },
                { description: { contains: query.search } },
            ];
        }

        const skip = (query.page - 1) * query.limit;

        const [records, total] = await Promise.all([
            prisma.financialRecord.findMany({
                where,
                orderBy: { date: 'desc' },
                include: { user: { select: { name: true, email: true } } },
                skip,
                take: query.limit,
            }),
            prisma.financialRecord.count({ where }),
        ]);

        return {
            records,
            pagination: {
                total,
                page: query.page,
                limit: query.limit,
                totalPages: Math.ceil(total / query.limit),
            },
        };
    },

    async getRecordById(id: string, userId: string, role: string) {
        const record = await prisma.financialRecord.findFirst({
            where: { id, deletedAt: null },
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

        await prisma.financialRecord.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        return { success: true };
    },
};
