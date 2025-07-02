/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           description: The ID of the product
 *         variant:
 *           type: string
 *           description: The ID of the product variant
 *         quantity:
 *           type: number
 *           description: Quantity of the item
 *           minimum: 1
 *         price:
 *           type: number
 *           description: Price of the item at the time of purchase
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the item was added to the order
 *       example:
 *         product: 60d21b4667d0d8992e610c85
 *         variant: 60d21b4667d0d8992e610c86
 *         quantity: 2
 *         price: 25.99
 *         createdAt: 2023-01-01T00:00:00.000Z
 *
 *     ShippingAddress:
 *       type: object
 *       required:
 *         - address
 *         - city
 *         - postalCode
 *         - country
 *       properties:
 *         address:
 *           type: string
 *           description: The street address
 *         city:
 *           type: string
 *           description: The city name
 *         postalCode:
 *           type: string
 *           description: The postal code
 *         country:
 *           type: string
 *           description: The country name
 *       example:
 *         address: 123 Main St
 *         city: New York
 *         postalCode: 10001
 *         country: USA
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the order
 *         user:
 *           type: string
 *           description: The ID of the user who placed the order
 *         items:
 *           type: array
 *           description: Array of order items
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         shippingAddress:
 *           $ref: '#/components/schemas/ShippingAddress'
 *         totalPrice:
 *           type: number
 *           description: Total price of the order
 *         status:
 *           type: string
 *           enum: [pending, paid, shipped, delivered, cancelled]
 *           description: Current status of the order
 *         paidAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: When the order was paid
 *         deliveredAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: When the order was delivered
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the order was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the order was last updated
 *       example:
 *         _id: 60d21b4667d0d8992e610c85
 *         user: 60d21b4667d0d8992e610c90
 *         items: [
 *           {
 *             product: 60d21b4667d0d8992e610c85,
 *             variant: 60d21b4667d0d8992e610c86,
 *             quantity: 2,
 *             price: 25.99,
 *             createdAt: 2023-01-01T00:00:00.000Z
 *           }
 *         ]
 *         shippingAddress: {
 *           address: 123 Main St,
 *           city: New York,
 *           postalCode: 10001,
 *           country: USA
 *         }
 *         totalPrice: 51.98
 *         status: paid
 *         paidAt: 2023-01-01T00:00:00.000Z
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 *
 *     CheckoutSession:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The checkout session ID
 *         url:
 *           type: string
 *           description: The URL to redirect the customer to
 *       example:
 *         id: cs_test_a1b2c3d4e5f6g7h8i9j0
 *         url: https://checkout.stripe.com/pay/cs_test_a1b2c3d4e5f6g7h8i9j0
 *
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and checkout
 *
 * @swagger
 * /api/v1/orders/checkout-session:
 *   post:
 *     summary: Create checkout session
 *     description: Create a new Stripe checkout session for the current user's cart. Requires a shipping address to be set first.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     session:
 *                       $ref: '#/components/schemas/CheckoutSession'
 *       400:
 *         description: Bad request - Missing shipping address
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * /api/v1/orders/success:
 *   get:
 *     summary: Verify order
 *     description: Verify and complete an order after successful checkout
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Query parameter indicating checkout success or failure
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user who placed the order
 *     responses:
 *       200:
 *         description: Order verified and created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Checkout completed successfully. Your order has been placed.
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       400:
 *         description: Checkout failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Checkout failed. Your order could not be processed.
 *
 * @swagger
 * /api/v1/orders/me:
 *   get:
 *     summary: Get current user's orders
 *     description: Retrieve all orders placed by the currently logged-in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields (e.g. createdAt,-totalPrice)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of orders to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to include (e.g. status,totalPrice)
 *     responses:
 *       200:
 *         description: A list of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 size:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized - User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve a list of all orders. Available only to admins.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields (e.g. createdAt,-totalPrice)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of orders to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to include (e.g. status,totalPrice)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, paid, shipped, delivered, cancelled]
 *         description: Filter orders by status
 *     responses:
 *       200:
 *         description: A list of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 size:
 *                   type: number
 *                   example: 10
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized - User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User is not an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     description: Retrieve a specific order by its ID. Available only to admins.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized - User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User is not an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not found - Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
