import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

import env from './config/env';
import { productRouter } from './routes/product.routes';
import { userRouter } from './routes/user.routes';
import APIError from './utils/APIError';
import globalErrorHandler from './middlewares/globalErrorHandler';

const app = express();

// Global Middlewares
app.use(express.json());

// Using morgan for HTTP requests
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);

// Handle Unhandled Routes
app.all(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
  next(new APIError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
