# Souqq

## Description

This is a RESTful API for an e-commerce platform. It provides endpoints for managing products, categories, orders, reviews, variants, and user authentication.

## Features

- User authentication and authorization
- Product and category management
- Order and checkout management
- Review and rating system
- Variant management for products
- Integration with third-party services like Stripe, Redis, Google OAuth, and Gemini AI

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/zeyadwaleed003/Souqq.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Souqq
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and configure it based on the `.env.example` file.

## Usage

1. Build the project:

   ```bash
   npm run build
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Access the API at `http://127.0.0.1:3000/api/v1` (default development URL).

For detailed API documentation with request/response examples, visit `/api/v1/api-docs` after starting the server.

## Tech Stack

### Core Technologies

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Validation**: Zod
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)

### Third-Party Integrations

- **Caching**: Redis
- **AI**: Google Gemini AI
- **OAuth**: Google OAuth 2.0
- **Payment Processing**: Stripe
- **Email Service**: Mailtrap (Development)
- **Cloud Storage**: Cloudinary (Image hosting)

## Project Structure

```tree
./
├── logs/
│   ├── app.log
│   └── error.log
├── src/
│   ├── config/
│   │   ├── cloudinary.ts
│   │   ├── email.ts
│   │   ├── env.ts
│   │   ├── logger.ts
│   │   ├── passport.ts
│   │   ├── redis.ts
│   │   ├── stripe.ts
│   │   └── swagger.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── category.controller.ts
│   │   ├── order.controller.ts
│   │   ├── product.controller.ts
│   │   ├── review.controller.ts
│   │   ├── user.controller.ts
│   │   └── variant.controller.ts
│   ├── docs/
│   │   ├── auth.swagger.ts
│   │   ├── cart.swagger.ts
│   │   ├── category.swagger.ts
│   │   ├── order.swagger.ts
│   │   ├── product.swagger.ts
│   │   ├── review.swagger.ts
│   │   ├── user.swagger.ts
│   │   └── variant.swagger.ts
│   ├── middlewares/
│   │   ├── globalErrorHandler.ts
│   │   ├── isAuthenticated.ts
│   │   ├── isAuthorized.ts
│   │   ├── notFound.ts
│   │   ├── upload.ts
│   │   └── validate.ts
│   ├── models/
│   │   ├── cart.model.ts
│   │   ├── category.model.ts
│   │   ├── order.model.ts
│   │   ├── product.model.ts
│   │   ├── review.model.ts
│   │   ├── user.model.ts
│   │   └── variant.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── category.routes.ts
│   │   ├── order.routes.ts
│   │   ├── product.routes.ts
│   │   ├── review.routes.ts
│   │   ├── user.routes.ts
│   │   └── variant.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── cart.service.ts
│   │   ├── category.service.ts
│   │   ├── cloudinary.service.ts
│   │   ├── gemini.service.ts
│   │   ├── order.service.ts
│   │   ├── product.service.ts
│   │   ├── redis.service.ts
│   │   ├── review.service.ts
│   │   ├── stripe.service.ts
│   │   ├── user.service.ts
│   │   └── variant.service.ts
│   ├── templates/
│   │   ├── emailVerify.pug
│   │   └── passwordReset.pug
│   ├── types/
│   │   ├── api.types.ts
│   │   ├── auth.types.ts
│   │   ├── cart.types.ts
│   │   ├── category.types.ts
│   │   ├── cloudinary.types.ts
│   │   ├── express.d.ts
│   │   ├── multer.d.ts
│   │   ├── order.types.ts
│   │   ├── product.types.ts
│   │   ├── review.types.ts
│   │   ├── user.types.ts
│   │   └── variant.types.ts
│   ├── utils/
│   │   ├── APIError.ts
│   │   ├── APIFeatures.ts
│   │   ├── functions.ts
│   │   ├── responseFormatter.ts
│   │   ├── sendEmail.ts
│   │   ├── sendResponse.ts
│   │   └── token.ts
│   ├── validation/
│   |   ├── auth.validation.ts
│   |   ├── base.validation.ts
│   |   ├── cart.validation.ts
│   |   ├── category.validation.ts
│   |   ├── product.validation.ts
│   |   ├── review.validation.ts
│   |   ├── user.validation.ts
│   |   └── variant.validation.ts
|   ├── app.ts
|   └── server.ts
|
├── .dockerignore
├── .env
├── .env.example
├── .gitignore
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── docker-compose.yml
├── Dockerfile
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── tsconfig.tsbuildinfo
```
