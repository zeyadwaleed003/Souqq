import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import env from './config/env';
import redis from './config/redis';
import passport from './config/passport';
import APIError from './utils/APIError';
import globalErrorHandler from './middlewares/globalErrorHandler';
import { userRouter } from './routes/user.routes';
import { authRouter } from './routes/auth.routes';
import { productRouter } from './routes/product.routes';
import { categoryRouter } from './routes/category.routes';
import { variantRouter } from './routes/variant.routes';
import { reviewRouter } from './routes/review.routes';
import { cartRouter } from './routes/cart.routes';

const app = express();

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again in one hour',
});

app.use(cors());
// app.options('*', cors());
app.use(helmet());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
// app.use(mongoSanitize());
app.use(passport.initialize());
app.use(compression());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/variants', variantRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/categories', categoryRouter);

// Handle Unhandled Routes
app.all(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
  next(new APIError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
