import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string(),
    role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
});

export const authService = {
    async signup(data: z.infer<typeof signupSchema>) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw { status: 400, message: 'User with this email already exists' };
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                role: data.role || 'VIEWER',
                status: 'ACTIVE',
            },
        });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    },

    async login(data: z.infer<typeof loginSchema>) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user || user.status === 'INACTIVE') {
            throw { status: 401, message: 'Invalid credentials or account inactive' };
        }

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) {
            throw { status: 401, message: 'Invalid credentials' };
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    },
};
