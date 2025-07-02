/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the review
 *         product:
 *           type: object
 *           description: Reference to the product being reviewed
 *           properties:
 *             _id:
 *               type: string
 *               description: Product ID
 *         user:
 *           type: object
 *           description: Reference to the user who wrote the review
 *           properties:
 *             _id:
 *               type: string
 *               description: User ID
 *             name:
 *               type: string
 *               description: User's name
 *             photo:
 *               type: string
 *               description: User's profile photo
 *         rating:
 *           type: number
 *           description: Rating given to the product (1-5)
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *           description: Detailed review comment
 *         isVerifiedPurchase:
 *           type: boolean
 *           description: Indicates if the review is from a verified purchase
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the review was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the review was last updated
 *       example:
 *         _id: 60d21b4667d0d8992e610c85
 *         product:
 *           _id: 60d21b4667d0d8992e610c80
 *         user:
 *           _id: 60d21b4667d0d8992e610c90
 *           name: John Doe
 *           photo: john-profile.jpg
 *         rating: 4
 *         comment: Great product, very satisfied with the purchase. Excellent build quality and performance.
 *         isVerifiedPurchase: true
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 *
 *     CreateReviewInput:
 *       type: object
 *       required:
 *         - rating
 *         - comment
 *       properties:
 *         rating:
 *           type: number
 *           description: Rating to give the product
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *           description: Detailed review comment
 *           minLength: 10
 *         product:
 *           type: string
 *           description: ID of the product being reviewed (optional if provided in URL)
 *       example:
 *         rating: 4
 *         comment: Great product, very satisfied with the purchase. Excellent build quality and performance.
 *
 *     UpdateReviewInput:
 *       type: object
 *       properties:
 *         rating:
 *           type: number
 *           description: Updated rating
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *           description: Updated review comment
 *           minLength: 10
 *       example:
 *         rating: 5
 *         comment: After using it more, I'm even more impressed! Excellent product that exceeded my expectations.
 *
 *     ReviewSummary:
 *       type: object
 *       properties:
 *         response:
 *           type: string
 *           description: AI-generated summary of product reviews
 *       example:
 *         response: "Based on 15 reviews, customers generally praise the product's durability and ease of use, with 80% of reviewers giving 4 or 5 stars. Common positive points include battery life and build quality, while a few customers mentioned issues with customer support."
 *
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product reviews management
 *
 * @swagger
 * /api/v1/products/{productId}/reviews:
 *   get:
 *     summary: Get reviews for a product
 *     description: Retrieve all reviews for a specific product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields (e.g. rating,-createdAt)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of reviews to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to include (e.g. rating,comment)
 *     responses:
 *       200:
 *         description: A list of reviews for the product
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
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Review'
 *
 *   post:
 *     summary: Create a new review
 *     description: Create a new review for a product. User must have purchased the product.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewInput'
 *     responses:
 *       201:
 *         description: Review created successfully
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
 *                     review:
 *                       $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request - Invalid input or user has not purchased the product
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
 *       409:
 *         description: Conflict - User has already reviewed this product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * /api/v1/products/{productId}/reviews/summary:
 *   get:
 *     summary: Get AI-generated summary of reviews
 *     description: Retrieve an AI-generated summary of all reviews for a specific product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: AI-generated summary of product reviews
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
 *                     response:
 *                       type: string
 *                       example: "Based on 15 reviews, customers generally praise the product's durability and ease of use..."
 *       400:
 *         description: Bad request - Product has no reviews
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * /api/v1/users/{userId}/reviews:
 *   get:
 *     summary: Get reviews by a user
 *     description: Retrieve all reviews written by a specific user
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields (e.g. rating,-createdAt)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of reviews to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to include (e.g. rating,comment)
 *     responses:
 *       200:
 *         description: A list of reviews by the user
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
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Review'
 *
 * @swagger
 * /api/v1/reviews/me:
 *   get:
 *     summary: Get current user's reviews
 *     description: Retrieve all reviews written by the currently logged-in user
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields (e.g. rating,-createdAt)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of reviews to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to include (e.g. rating,comment)
 *     responses:
 *       200:
 *         description: A list of the current user's reviews
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
 *                     Reviews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized - User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * /api/v1/reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     description: Retrieve a specific review by its ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review retrieved successfully
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
 *                     review:
 *                       $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   patch:
 *     summary: Update a review
 *     description: Update a specific review. Users can only update their own reviews.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReviewInput'
 *     responses:
 *       200:
 *         description: Review updated successfully
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
 *                     review:
 *                       $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request - Invalid input
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
 *       403:
 *         description: Forbidden - Not the review owner or admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     summary: Delete a review
 *     description: Delete a specific review. Users can only delete their own reviews.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       204:
 *         description: Review deleted successfully
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
 *         description: Unauthorized - User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not the review owner or admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
