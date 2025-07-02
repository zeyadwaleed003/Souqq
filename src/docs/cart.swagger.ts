/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - variant
 *         - quantity
 *       properties:
 *         variant:
 *           type: string
 *           description: The ID of the product variant
 *         quantity:
 *           type: number
 *           description: Quantity of the item
 *           minimum: 1
 *         price:
 *           type: number
 *           description: Price of the item at the time of adding to cart
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the item was added to the cart
 *       example:
 *         variant: 60d21b4667d0d8992e610c85
 *         quantity: 2
 *         price: 25.99
 *         createdAt: 2023-01-01T00:00:00.000Z
 *
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the cart
 *         user:
 *           type: string
 *           description: The ID of the user who owns the cart
 *         items:
 *           type: array
 *           description: Array of cart items
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         totalPrice:
 *           type: number
 *           description: Total price of all items in the cart
 *         totalItems:
 *           type: number
 *           description: Total number of items in the cart
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the cart was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the cart was last updated
 *       example:
 *         _id: 60d21b4667d0d8992e610c85
 *         user: 60d21b4667d0d8992e610c90
 *         items: [
 *           {
 *             variant: 60d21b4667d0d8992e610c85,
 *             quantity: 2,
 *             price: 25.99,
 *             createdAt: 2023-01-01T00:00:00.000Z
 *           }
 *         ]
 *         totalPrice: 51.98
 *         totalItems: 2
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 *
 *     AddToCartInput:
 *       type: object
 *       required:
 *         - variant
 *         - quantity
 *       properties:
 *         variant:
 *           type: string
 *           description: The ID of the product variant
 *         quantity:
 *           type: number
 *           description: Quantity of the item
 *           minimum: 1
 *       example:
 *         variant: 60d21b4667d0d8992e610c85
 *         quantity: 2
 *
 *     UpdateQuantityInput:
 *       type: object
 *       required:
 *         - variant
 *         - quantity
 *       properties:
 *         variant:
 *           type: string
 *           description: The ID of the product variant
 *         quantity:
 *           type: number
 *           description: New quantity of the item
 *           minimum: 1
 *       example:
 *         variant: 60d21b4667d0d8992e610c85
 *         quantity: 3
 *
 *     RemoveItemInput:
 *       type: object
 *       required:
 *         - variant
 *       properties:
 *         variant:
 *           type: string
 *           description: The ID of the product variant to remove
 *       example:
 *         variant: 60d21b4667d0d8992e610c85
 *
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 *
 * @swagger
 * /api/v1/carts/me:
 *   get:
 *     summary: Get current user's cart
 *     description: Retrieve the shopping cart for the currently logged-in user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
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
 *                     cart:
 *                       $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized - User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * /api/v1/carts/clear:
 *   patch:
 *     summary: Clear cart
 *     description: Remove all items from the current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
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
 *                   example: Cart has been cleared successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart:
 *                       $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized - User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * /api/v1/carts/items/quantity:
 *   patch:
 *     summary: Update item quantity
 *     description: Update the quantity of an item in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateQuantityInput'
 *     responses:
 *       200:
 *         description: Item quantity updated successfully
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
 *                   example: Item quantity has been updated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart:
 *                       $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Bad request - Invalid quantity or variant
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
 *       404:
 *         description: Not found - Item not in cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * /api/v1/carts/items:
 *   patch:
 *     summary: Add item to cart
 *     description: Add a product variant to the shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartInput'
 *     responses:
 *       200:
 *         description: Item added to cart successfully
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
 *                   example: Item has been added to your cart.
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart:
 *                       $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Bad request - Invalid quantity or variant
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
 *       404:
 *         description: Not found - Product variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     summary: Remove item from cart
 *     description: Remove a specific item from the shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RemoveItemInput'
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
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
 *                   example: Item has been removed from your cart.
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart:
 *                       $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized - User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not found - Item not in cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * /api/v1/carts:
 *   get:
 *     summary: Get all carts
 *     description: Retrieve a list of all user carts. Available only to admins.
 *     tags: [Cart]
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
 *         description: Maximum number of carts to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to include (e.g. user,totalPrice)
 *     responses:
 *       200:
 *         description: A list of carts
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
 *                     carts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Cart'
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
 * /api/v1/carts/{id}:
 *   get:
 *     summary: Get cart by ID
 *     description: Retrieve a specific cart by its ID. Available only to admins.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
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
 *                     cart:
 *                       $ref: '#/components/schemas/Cart'
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
 *         description: Not found - Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * /api/v1/variants/{variantId}/carts:
 *   patch:
 *     summary: Add variant to cart by ID
 *     description: Add a specific variant to the cart using its ID in the URL
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: Quantity of the item
 *                 minimum: 1
 *             example:
 *               quantity: 2
 *     responses:
 *       200:
 *         description: Item added to cart successfully
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
 *                     cart:
 *                       $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized - User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
