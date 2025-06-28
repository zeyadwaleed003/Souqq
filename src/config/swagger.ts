import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for E-Commerce API',
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/docs/*.swagger.ts'],
};
