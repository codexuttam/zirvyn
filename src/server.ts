import 'dotenv/config';
import app from './app.js';
import prisma from './utils/prisma.js';

const PORT = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('Connected to database');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
