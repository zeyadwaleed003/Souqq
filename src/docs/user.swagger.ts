/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         photo:
 *           type: string
 *           description: User's profile photo filename
 *           default: default.png
 *         role:
 *           type: string
 *           enum: [admin, user, seller]
 *           default: user
 *           description: User's role
 *         emailVerified:
 *           type: boolean
 *           default: false
 *           description: Whether user's email is verified
 *         active:
 *           type: boolean
 *           default: true
 *           description: Whether user account is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: User creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: User last update timestamp
 *         __v:
 *           type: integer
 *           description: Document version key (MongoDB internal)
 *           example: 0
 *       required:
 *         - name
 *         - email
 *       example:
 *         _id: "60f7b3b3b3b3b3b3b3b3b3b3"
 *         name: "John Doe"
 *         email: "john@example.com"
 *         photo: "user-123.jpg"
 *         role: "user"
 *         emailVerified: true
 *         active: true
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 *         __v: 0
 *
 *     CreateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           minLength: 8
 *           description: User's password
 *         role:
 *           type: string
 *           enum: [admin, user, seller]
 *           default: user
 *           description: User's role
 *         googleId:
 *           type: string
 *           description: Google OAuth ID
 *         emailVerified:
 *           oneOf:
 *             - type: boolean
 *             - type: string
 *               enum: ['true', 'false']
 *           default: true
 *           description: Whether user's email is verified (boolean or string)
 *         photo:
 *           type: string
 *           format: binary
 *           description: User's profile photo
 *         active:
 *           oneOf:
 *             - type: boolean
 *             - type: string
 *               enum: ['true', 'false']
 *           description: Whether user account is active (boolean or string)
 *       required:
 *         - name
 *         - email
 *         - password
 *       example:
 *         name: "John Doe"
 *         email: "john@example.com"
 *         password: "password123"
 *         role: "user"
 *
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           minLength: 8
 *           description: User's password
 *         role:
 *           type: string
 *           enum: [admin, user, seller]
 *           description: User's role
 *         active:
 *           oneOf:
 *             - type: boolean
 *             - type: string
 *               enum: ['true', 'false']
 *           description: Whether user account is active (boolean or string)
 *         emailVerified:
 *           oneOf:
 *             - type: boolean
 *             - type: string
 *               enum: ['true', 'false']
 *           description: Whether user's email is verified (boolean or string)
 *         googleId:
 *           type: string
 *           description: Google OAuth ID
 *         photo:
 *           type: string
 *           format: binary
 *           description: User's profile photo
 *       example:
 *         name: "John Smith"
 *         email: "johnsmith@example.com"
 *         role: "seller"
 *
 *     UpdateMeRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           description: User's full name
 *         photo:
 *           type: string
 *           format: binary
 *           description: User's profile photo
 *       example:
 *         name: "John Smith"
 *
 *     UsersResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         statusCode:
 *           type: integer
 *           example: 200
 *         size:
 *           type: integer
 *           description: Number of users returned
 *         data:
 *           type: object
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       example:
 *         status: "success"
 *         statusCode: 200
 *         size: 1
 *         data:
 *           users:
 *             - _id: "60f7b3b3b3b3b3b3b3b3b3b3"
 *               name: "John Doe"
 *               email: "john@example.com"
 *               photo: "user-123.jpg"
 *               role: "user"
 *               emailVerified: true
 *               active: true
 *               createdAt: "2023-01-01T00:00:00.000Z"
 *               updatedAt: "2023-01-01T00:00:00.000Z"
 *               __v: 0
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         statusCode:
 *           type: integer
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *
 *     MeResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         statusCode:
 *           type: integer
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: User ID
 *                 name:
 *                   type: string
 *                   description: User's full name
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: User's email address
 *                 photo:
 *                   type: string
 *                   description: User's profile photo filename
 *                 role:
 *                   type: string
 *                   enum: [admin, user, seller]
 *                   description: User's role
 *                 emailVerified:
 *                   type: boolean
 *                   description: Whether user's email is verified
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: User creation timestamp
 *               example:
 *                 _id: "60f7b3b3b3b3b3b3b3b3b3b3"
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *                 photo: "user-123.jpg"
 *                 role: "user"
 *                 emailVerified: true
 *                 createdAt: "2023-01-01T00:00:00.000Z"
 *
 *     DeleteResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         statusCode:
 *           type: integer
 *           example: 204
 *         message:
 *           type: string
 *           example: Document deleted successfully
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of users per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g., 'name', '-createdAt')
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to include/exclude (e.g., 'name,email')
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersResponse'
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Access forbidden - Admin role required
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Access forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeResponse'
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Internal server error
 *
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMeRequest'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMeRequest'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeResponse'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Deactivate current user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User account deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeResponse'
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *
 *   patch:
 *     summary: Update user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Access forbidden - Admin role required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       204:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Access forbidden - Admin role required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/users/{userId}/reviews:
 *   get:
 *     summary: Get reviews for a specific user
 *     tags: [Users, Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of reviews per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g., 'rating', '-createdAt')
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to include/exclude (e.g., 'rating,comment')
 *     responses:
 *       200:
 *         description: User reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 size:
 *                   type: integer
 *                   description: Number of reviews returned
 *                 data:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Review'
 *               example:
 *                 status: "success"
 *                 size: 1
 *                 data:
 *                   reviews:
 *                     - _id: "60f7b3b3b3b3b3b3b3b3b3b5"
 *                       product: "60f7b3b3b3b3b3b3b3b3b4"
 *                       user:
 *                         _id: "60f7b3b3b3b3b3b3b3b3b3b5"
 *                         name: "John Doe"
 *                       rating: 4
 *                       comment: "Great product!"
 *                       isVerifiedPurchase: true
 *                       helpfulCount: 2
 *                       helpfulBy: ["60f7b3b3b3b3b3b3b3b3b3b6", "60f7b3b3b3b3b3b3b3b3b3b7"]
 *                       createdAt: "2023-01-15T10:30:00.000Z"
 *                       updatedAt: "2023-01-15T10:30:00.000Z"
 *                       __v: 0
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
