# E-Commerce API

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
   git clone https://github.com/zeyadwaleed003/E-Commerce-API.git
   ```

2. Navigate to the project directory:

   ```bash
   cd e-commerce-api
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

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Access the API at `http://127.0.0.1:3000/api/v1` (default development URL).

## Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the project for production
- `npm start`: Start the production server

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Redis
- Stripe
- Google OAuth
- Gemini AI

## API Documentation

### Base URL

All API endpoints are prefixed with `/api/v1`

### Authentication

Most endpoints require authentication using JWT Bearer tokens:

```bash
Authorization: Bearer <your_access_token>
```

#### Auth Endpoints

| Method | Endpoint                      | Description                  |
| ------ | ----------------------------- | ---------------------------- |
| POST   | `/auth/signup`                | Register a new user          |
| POST   | `/auth/login`                 | Login and get access token   |
| POST   | `/auth/refresh-token`         | Refresh expired access token |
| POST   | `/auth/forgot-password`       | Request password reset email |
| PATCH  | `/auth/reset-password/:token` | Reset password with token    |
| PATCH  | `/auth/update-password`       | Update current user password |
| GET    | `/auth/google`                | Google OAuth login           |
| GET    | `/auth/google/callback`       | Google OAuth callback        |

### Users

| Method | Endpoint                  | Description                    |
| ------ | ------------------------- | ------------------------------ |
| GET    | `/users`                  | Get all users (admin only)     |
| POST   | `/users`                  | Create a new user (admin only) |
| GET    | `/users/me`               | Get current user profile       |
| PATCH  | `/users/me`               | Update current user profile    |
| DELETE | `/users/me`               | Delete current user            |
| POST   | `/users/shipping-address` | Save shipping address          |
| GET    | `/users/:id`              | Get user by ID                 |
| PATCH  | `/users/:id`              | Update user (admin only)       |
| DELETE | `/users/:id`              | Delete user (admin only)       |
| GET    | `/users/:userId/reviews`  | Get reviews by a user          |

### Products

| Method | Endpoint                               | Description                         |
| ------ | -------------------------------------- | ----------------------------------- |
| GET    | `/products`                            | Get all products                    |
| POST   | `/products`                            | Create a new product (admin/seller) |
| GET    | `/products/:id`                        | Get product by ID                   |
| PATCH  | `/products/:id`                        | Update product (admin/seller)       |
| DELETE | `/products/:id`                        | Delete product (admin only)         |
| POST   | `/products/:id/images`                 | Add images to product               |
| DELETE | `/products/:id/images`                 | Delete images from product          |
| GET    | `/products/:productId/reviews`         | Get product reviews                 |
| POST   | `/products/:productId/reviews`         | Create product review               |
| GET    | `/products/:productId/reviews/summary` | Get AI-generated review summary     |

### Categories

| Method | Endpoint                        | Description                    |
| ------ | ------------------------------- | ------------------------------ |
| GET    | `/categories`                   | Get all categories             |
| POST   | `/categories`                   | Create a category (admin only) |
| GET    | `/categories/top-level`         | Get top-level categories       |
| GET    | `/categories/slug/:slug`        | Get category by slug           |
| GET    | `/categories/:id`               | Get category by ID             |
| PATCH  | `/categories/:id`               | Update category (admin only)   |
| DELETE | `/categories/:id`               | Delete category (admin only)   |
| GET    | `/categories/:id/subcategories` | Get subcategories              |
| GET    | `/categories/:id/products`      | Get category products          |

### Variants

| Method | Endpoint                     | Description                      |
| ------ | ---------------------------- | -------------------------------- |
| GET    | `/variants`                  | Get all variants                 |
| POST   | `/variants`                  | Create a variant (admin/seller)  |
| GET    | `/variants/active`           | Get active variants              |
| GET    | `/variants/cheapest`         | Get cheapest variant per product |
| GET    | `/variants/:id`              | Get variant by ID                |
| PATCH  | `/variants/:id`              | Update variant (admin/seller)    |
| DELETE | `/variants/:id`              | Delete variant (admin only)      |
| PATCH  | `/variants/:id/deactivate`   | Deactivate a variant             |
| POST   | `/variants/:id/images`       | Add images to variant            |
| DELETE | `/variants/:id/images`       | Delete images from variant       |
| PATCH  | `/variants/:variantId/carts` | Add variant to cart              |

### Orders

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| GET    | `/orders`                  | Get all orders (admin only) |
| GET    | `/orders/me`               | Get current user's orders   |
| POST   | `/orders/checkout-session` | Create checkout session     |
| GET    | `/orders/success`          | Verify order after checkout |
| GET    | `/orders/:id`              | Get order by ID             |

### Reviews

| Method | Endpoint       | Description                |
| ------ | -------------- | -------------------------- |
| GET    | `/reviews/me`  | Get current user's reviews |
| GET    | `/reviews/:id` | Get review by ID           |
| PATCH  | `/reviews/:id` | Update review              |
| DELETE | `/reviews/:id` | Delete review              |

### Carts

| Method | Endpoint                 | Description                |
| ------ | ------------------------ | -------------------------- |
| GET    | `/carts`                 | Get all carts (admin only) |
| GET    | `/carts/me`              | Get current user's cart    |
| PATCH  | `/carts/add-item`        | Add item to cart           |
| PATCH  | `/carts/remove-item`     | Remove item from cart      |
| PATCH  | `/carts/clear`           | Clear cart                 |
| PATCH  | `/carts/update-quantity` | Update item quantity       |

For detailed API documentation with request/response examples, visit `/api/v1/api-docs` after starting the server.

## Response Format

All API responses follow a consistent format:

```ts
{
  "status": "success" | "fail" | "error",
  "statusCode": 200 | 201 | 400 | 401 | 403 | 404 | 500,
  "size": 10,  // for list responses
  "message": "Optional success or error message",
  "data": {
    // Response data varies by endpoint
  }
}
```
