/**
 * @swagger
 * components:
 *   schemas:
 *     Variant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the variant
 *         price:
 *           type: number
 *           description: Current price of the variant
 *         oldPrice:
 *           type: number
 *           description: Previous price of the variant (for sales/discounts)
 *         stock:
 *           type: number
 *           description: Quantity available in stock
 *         sku:
 *           type: string
 *           description: Stock keeping unit - unique identifier for the variant
 *         size:
 *           type: string
 *           description: Size of the variant (e.g., S, M, L, XL)
 *         color:
 *           type: string
 *           description: Color of the variant
 *         status:
 *           type: string
 *           enum: [active, inactive, draft, out-of-stock]
 *           description: Current status of the variant
 *         product:
 *           type: object
 *           description: Reference to the parent product
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Images specific to this variant
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the variant was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the variant was last updated
 *       example:
 *         _id: 60d21b4667d0d8992e610c86
 *         price: 999.99
 *         oldPrice: 1299.99
 *         stock: 50
 *         sku: IPHONE-13-PRO-256-BLUE
 *         size: 256GB
 *         color: Pacific Blue
 *         status: active
 *         product:
 *           _id: 60d21b4667d0d8992e610c85
 *           name: iPhone 13 Pro
 *         images: [iphone-13-pro-blue-1.jpg, iphone-13-pro-blue-2.jpg]
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 *
 *     CreateVariantInput:
 *       type: object
 *       required:
 *         - price
 *         - stock
 *         - product
 *       properties:
 *         price:
 *           type: number
 *           description: Current price of the variant
 *           minimum: 0
 *         oldPrice:
 *           type: number
 *           description: Previous price of the variant (for sales/discounts)
 *           minimum: 0
 *         stock:
 *           type: number
 *           description: Quantity available in stock
 *           minimum: 0
 *         sku:
 *           type: string
 *           description: Stock keeping unit - unique identifier for the variant
 *         size:
 *           type: string
 *           description: Size of the variant (e.g., S, M, L, XL)
 *         color:
 *           type: string
 *           description: Color of the variant
 *         status:
 *           type: string
 *           enum: [active, inactive, draft, out-of-stock]
 *           description: Current status of the variant
 *         product:
 *           type: string
 *           description: ID of the parent product
 *       example:
 *         price: 999.99
 *         oldPrice: 1299.99
 *         stock: 50
 *         sku: IPHONE-13-PRO-256-BLUE
 *         size: 256GB
 *         color: Pacific Blue
 *         product: 60d21b4667d0d8992e610c85
 *
 *     UpdateVariantInput:
 *       type: object
 *       properties:
 *         price:
 *           type: number
 *           description: Current price of the variant
 *           minimum: 0
 *         oldPrice:
 *           type: number
 *           description: Previous price of the variant (for sales/discounts)
 *           minimum: 0
 *         stock:
 *           type: number
 *           description: Quantity available in stock
 *           minimum: 0
 *         sku:
 *           type: string
 *           description: Stock keeping unit - unique identifier for the variant
 *         size:
 *           type: string
 *           description: Size of the variant (e.g., S, M, L, XL)
 *         color:
 *           type: string
 *           description: Color of the variant
 *         status:
 *           type: string
 *           enum: [active, inactive, draft, out-of-stock]
 *           description: Current status of the variant
 *       example:
 *         price: 899.99
 *         stock: 100
 *         status: active
 *
 *     VariantImagesInput:
 *       type: object
 *       required:
 *         - images
 *       properties:
 *         images:
 *           type: array
 *           description: Array of image filenames
 *           items:
 *             type: string
 *       example:
 *         images: [iphone-13-pro-blue-3.jpg, iphone-13-pro-blue-4.jpg]
 *
 * @swagger
 * tags:
 *   name: Variants
 *   description: Product variant management
 *
 * @swagger
 * /api/v1/variants:
 *   get:
 *     summary: Get all variants
 *     description: Retrieve a list of all product variants with filtering, sorting, and pagination
 *     tags: [Variants]
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields (e.g. price,-createdAt)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of variants to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to include (e.g. price,stock)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: A list of variants
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
 *                     variants:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Variant'
 *
 *   post:
 *     summary: Create a new variant
 *     description: Create a new product variant. Admin and seller access required.
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/CreateVariantInput'
 *               - type: object
 *                 properties:
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: binary
 *                     description: Variant images
 *     responses:
 *       201:
 *         description: Variant created successfully
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
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     variant:
 *                       $ref: '#/components/schemas/Variant'
 *       400:
 *         description: Bad request - Invalid input or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not an admin or seller, or not authorized for this product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict - A variant with the same attributes already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * /api/v1/variants/active:
 *   get:
 *     summary: Get active variants
 *     description: Retrieve a list of all active product variants
 *     tags: [Variants]
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields (e.g. price,-createdAt)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of variants to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to include (e.g. price,stock)
 *     responses:
 *       200:
 *         description: A list of active variants
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
 *                     variants:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Variant'
 *
 * @swagger
 * /api/v1/variants/cheapest:
 *   get:
 *     summary: Get cheapest variants per product
 *     description: Retrieve the cheapest variant for each product
 *     tags: [Variants]
 *     responses:
 *       200:
 *         description: A list of the cheapest variants for each product
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
 *                     variants:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Variant'
 *
 * @swagger
 * /api/v1/variants/{id}:
 *   get:
 *     summary: Get a variant by ID
 *     description: Retrieve details of a specific product variant by its ID
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant details retrieved successfully
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
 *                     variant:
 *                       $ref: '#/components/schemas/Variant'
 *       404:
 *         description: Variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   patch:
 *     summary: Update a variant
 *     description: Update a specific product variant. Admin and seller access required. Sellers can only update their own products' variants.
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/UpdateVariantInput'
 *               - type: object
 *                 properties:
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: binary
 *                     description: Variant images to add or replace
 *     responses:
 *       200:
 *         description: Variant updated successfully
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
 *                     variant:
 *                       $ref: '#/components/schemas/Variant'
 *       400:
 *         description: Bad request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not an admin or not the seller of this product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict - A variant with the same attributes already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     summary: Delete a variant
 *     description: Delete a specific product variant. Admin access required.
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     responses:
 *       204:
 *         description: Variant deleted successfully
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
 *                   example: 204
 *                 message:
 *                   type: string
 *                   example: Document deleted successfully
 *       401:
 *         description: Unauthorized - Not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * /api/v1/variants/{id}/deactivate:
 *   patch:
 *     summary: Deactivate a variant
 *     description: Set a variant's status to inactive. Admin access required.
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant deactivated successfully
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
 *                     variant:
 *                       $ref: '#/components/schemas/Variant'
 *       401:
 *         description: Unauthorized - Not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * /api/v1/variants/{id}/images:
 *   post:
 *     summary: Add images to a variant
 *     description: Add new images to a specific variant. Admin and seller access required. Sellers can only update their own products' variants.
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Variant images to add
 *     responses:
 *       200:
 *         description: Images added successfully
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
 *                   example: Images added successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     variant:
 *                       $ref: '#/components/schemas/Variant'
 *       400:
 *         description: Bad request - No images provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not an admin or not the seller of this product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     summary: Delete images from a variant
 *     description: Delete specific images from a variant. Admin and seller access required. Sellers can only update their own products' variants.
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VariantImagesInput'
 *     responses:
 *       200:
 *         description: Images deleted successfully
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
 *                   example: Images deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     variant:
 *                       $ref: '#/components/schemas/Variant'
 *       400:
 *         description: Bad request - No images to delete or variant has no images
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not an admin or not the seller of this product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * /api/v1/variants/{variantId}/carts:
 *   patch:
 *     summary: Add variant to cart
 *     description: Add a specific variant to the user's cart using the variant ID in the URL
 *     tags: [Variants, Cart]
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
 *                 description: Quantity of the variant to add
 *                 minimum: 1
 *             example:
 *               quantity: 1
 *     responses:
 *       200:
 *         description: Variant added to cart successfully
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
 *       400:
 *         description: Bad request - Invalid quantity or variant unavailable
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
 *         description: Not found - Variant not found or cart not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
