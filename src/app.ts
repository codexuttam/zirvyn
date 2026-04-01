import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.handler.js';

import rateLimit from 'express-rate-limit';

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(cors());
app.use(express.json());
app.use('/api', limiter);

// Main Router
app.use('/api', routes);

// 404 Route
app.use((req, res) => {
    res.status(404).json({ message: 'Resource not found' });
});

// Error Handler
app.use(errorHandler);

export default app;
