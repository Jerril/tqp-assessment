import http from 'http';
import express, { Express, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

const router: Express = express();


/* Routes */
router.get('/api/age', (req: Request, res: Response, next: NextFunction) => {
    res.send('hello world');
});

/* Error handling */
router.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('Not found');
    return res.status(404).json({
        message: error.message
    });
});

const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 8000;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));