import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/error.handler';

const app = express();

app.use(cors());
app.use(express.json());

// Main Router
app.use('/api', routes);

// 404 Route
app.use((req, res) => {
    res.status(404).json({ message: 'Resource not found' });
});

// Error Handler
app.use(errorHandler);

export default app;
