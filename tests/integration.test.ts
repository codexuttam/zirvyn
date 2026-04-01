import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/utils/prisma.js';

describe('Auth & Dashboard Flow', () => {
    let token: string;

    beforeAll(async () => {
        // Clean up or use a test DB ideally, but here we just use what we have
        // Actually, don't delete to avoid breaking user's manual data
    });

    it('should signup a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Test User',
                email: `test_${Date.now()}@example.com`,
                password: 'password123',
                role: 'ADMIN'
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('should get the dashboard summary', async () => {
        const res = await request(app)
            .get('/api/dashboard/summary')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('summary');
    });

    it('should enforce role-based access for user listing', async () => {
        // Create a viewer user
        const signupRes = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Viewer User',
                email: `viewer_${Date.now()}@example.com`,
                password: 'password123',
                role: 'VIEWER'
            });

        const viewerToken = signupRes.body.token;

        // Viewers should NOT be able to see all users
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${viewerToken}`);

        expect(res.status).toBe(403);
    });
});
