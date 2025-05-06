import express, { Request, Response } from 'express';
import morgan from 'morgan';
import env from './config/env';

const app = express();

// Global Middlewares
app.use(express.json());

app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

export default app;
