import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Configs & Utils
import env from './config/env';
import passport from './config/passport';

// Middlewares
import notFound from './middlewares/notFound';
import globalErrorHandler from './middlewares/globalErrorHandler';

// Routers
import { userRouter } from './routes/user.routes';
import { authRouter } from './routes/auth.routes';
import { cartRouter } from './routes/cart.routes';
import { orderRouter } from './routes/order.routes';
import { reviewRouter } from './routes/review.routes';
import { productRouter } from './routes/product.routes';
import { variantRouter } from './routes/variant.routes';
import { categoryRouter } from './routes/category.routes';

// Swagger Setup
import swaggerJsDocs from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './config/swagger';

const app = express();

// Swagger Docs
const swaggerSpec = swaggerJsDocs(swaggerOptions);
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rate Limiters
const apiLimiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again in one hour',
});

const authLimiter = rateLimit({
  max: 5,
  windowMs: 1 * 60 * 1000,
  message: 'Too many attempts, please try again later',
});

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(apiLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(passport.initialize());
app.use(compression());

// Routes
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/auth', authLimiter, authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/variants', variantRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/categories', categoryRouter);

// Error Handling
app.all(/(.*)/, notFound);
app.use(globalErrorHandler);

export default app;
