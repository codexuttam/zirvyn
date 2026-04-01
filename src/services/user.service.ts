import prisma from '../utils/prisma.js';
import { z } from 'zod';

export const updateUserSchema = z.object({
    name: z.string().optional(),
    role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const userService = {
    async getAllUsers() {
        return prisma.user.findMany({
            where: { deletedAt: null },
            select: { id: true, email: true, name: true, role: true, status: true, createdAt: true },
        });
    },

    async getUserById(id: string) {
        const user = await prisma.user.findFirst({
            where: { id, deletedAt: null },
            select: { id: true, email: true, name: true, role: true, status: true, createdAt: true },
        });

        if (!user) throw { status: 404, message: 'User not found' };
        return user;
    },

    async updateUser(id: string, data: z.infer<typeof updateUserSchema>) {
        const user = await prisma.user.update({
            where: { id },
            data,
            select: { id: true, email: true, name: true, role: true, status: true, updatedAt: true },
        });

        return user;
    },

    async deleteUser(id: string) {
        await prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), status: 'INACTIVE' },
        });
        return { success: true };
    },
};
