import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

import env from './config/env';
import { productRouter } from './routes/product.routes';

const app = express();

// Global Middlewares
app.use(express.json());

// Using morgan for HTTP requests
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

app.use('/api/v1/products', productRouter);

// Handle Unhandled Routes
app.all(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

export default app;
