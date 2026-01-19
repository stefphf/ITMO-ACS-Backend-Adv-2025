"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const likeController_1 = require("../controllers/likeController");
const common_service_1 = require("common-service");
const router = (0, express_1.Router)();
/**
 * @openapi
 * tags:
 *   - name: Like
 */
/**
 * @openapi
 * /like:
 *   post:
 *     tags:
 *       - Like
 *     summary: Создать лайк
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipeId
 *             properties:
 *               recipeId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Like'
 *       400:
 *         description: Invalid Input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.post('/', common_service_1.authMiddleware, likeController_1.createLike);
/**
 * @openapi
 * /like/mine:
 *   get:
 *     tags:
 *       - Like
 *     summary: Мои лайки
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful Response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Like'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/mine', common_service_1.authMiddleware, likeController_1.getOwnLikes);
/**
 * @openapi
 * /like/all:
 *   get:
 *     tags:
 *       - Like
 *     summary: Все лайки
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful Response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Like'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access Denied
 *       500:
 *         description: Internal Server Error
 */
router.get('/all', common_service_1.authMiddleware, common_service_1.adminOnlyMiddleware, likeController_1.getLikes);
/**
 * @openapi
 * /like/{id}:
 *   get:
 *     tags:
 *       - Like
 *     summary: Лайк
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID лайка
 *     responses:
 *       200:
 *         description: Successful Response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Like'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access Denied
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', common_service_1.authMiddleware, common_service_1.adminOnlyMiddleware, likeController_1.getLike);
/**
 * @openapi
 * /like/{id}:
 *   delete:
 *     tags:
 *       - Like
 *     summary: Удалить лайк
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID лайка
 *     responses:
 *       204:
 *         description: Deleted Successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access Denied
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', common_service_1.authMiddleware, likeController_1.deleteLike);
/**
 * @openapi
 * /like/recipe/{recipeId}:
 *   get:
 *     tags:
 *       - Like
 *     summary: Лайки для рецепта
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID рецепта
 *     responses:
 *       200:
 *         description: Successful Response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Like'
 *       400:
 *         description: Invalid Input
 *       500:
 *         description: Internal Server Error
 */
router.get('/recipe/:recipeId', likeController_1.getLikesByRecipe);
/**
 * @openapi
 * /like/user/{userId}:
 *   get:
 *     tags:
 *       - Like
 *     summary: Лайки пользователя
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Successful Response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Like'
 *       400:
 *         description: Invalid Input
 *       500:
 *         description: Internal Server Error
 */
router.get('/user/:userId', likeController_1.getLikesByUser);
exports.default = router;
