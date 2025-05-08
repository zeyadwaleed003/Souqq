import express from 'express';
import morgan from 'morgan';

import env from './config/env';
import { productRouter } from './routes/product.routes';

const app = express();

// Global Middlewares
app.use(express.json());

// Using morgan for HTTP requests
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

app.use('/api/v1/products', productRouter);

export default app;
