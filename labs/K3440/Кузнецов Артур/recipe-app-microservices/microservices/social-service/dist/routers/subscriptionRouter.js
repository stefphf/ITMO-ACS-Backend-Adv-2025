"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const common_service_1 = require("common-service");
const subscriptionController_1 = require("../controllers/subscriptionController");
const router = (0, express_1.Router)();
/**
 * @openapi
 * tags:
 *   - name: Subscription
 */
/**
 * @openapi
 * /subscription:
 *   post:
 *     tags:
 *       - Subscription
 *     summary: Создать подписку
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - followingId
 *             properties:
 *               followerId:
 *                 type: integer
 *               followingId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: You can not subscribe to yourself
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.post('/', common_service_1.authMiddleware, subscriptionController_1.createSubscription);
/**
 * @openapi
 * /subscription/all:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Все подписки
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
 *                 $ref: '#/components/schemas/Subscription'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access Denied
 *       500:
 *         description: Internal Server Error
 */
router.get('/all', common_service_1.authMiddleware, common_service_1.adminOnlyMiddleware, subscriptionController_1.getSubscriptions);
/**
 * @openapi
 * /subscription/following/{userId}:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Подписки пользователя
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
 *                 $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get('/following/:userId', subscriptionController_1.getFollowingOf);
/**
 * @openapi
 * /subscription/followers/{userId}:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Подписчики пользователя
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
 *                 $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get('/followers/:userId', subscriptionController_1.getFollowersOf);
/**
 * @openapi
 * /subscription/mine/following:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Мои подписки
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
 *                 $ref: '#/components/schemas/Subscription'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/mine/following', common_service_1.authMiddleware, subscriptionController_1.getOwnFollowing);
/**
 * @openapi
 * /subscription/mine/followers:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Мои подписчики
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
 *                 $ref: '#/components/schemas/Subscription'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/mine/followers', common_service_1.authMiddleware, subscriptionController_1.getOwnFollowers);
/**
 * @openapi
 * /subscription/{id}:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Подписка
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID подписки
 *     responses:
 *       200:
 *         description: Successful Response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', subscriptionController_1.getSubscription);
/**
 * @openapi
 * /subscription/{id}:
 *   delete:
 *     tags:
 *       - Subscription
 *     summary: Удалить подписку
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID подписки
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
router.delete('/:id', common_service_1.authMiddleware, subscriptionController_1.deleteSubscription);
exports.default = router;
