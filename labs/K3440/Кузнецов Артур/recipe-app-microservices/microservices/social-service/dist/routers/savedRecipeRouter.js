"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const savedRecipeController_1 = require("../controllers/savedRecipeController");
const common_service_1 = require("common-service");
const router = (0, express_1.Router)();
/**
 * @openapi
 * tags:
 *   - name: SavedRecipe
 */
/**
 * @openapi
 * /saved-recipe:
 *   get:
 *     tags:
 *       - SavedRecipe
 *     summary: Список сохраненных рецептов
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SavedRecipe'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/', common_service_1.authMiddleware, savedRecipeController_1.getSavedRecipes);
/**
 * @openapi
 * /saved-recipe:
 *   post:
 *     tags:
 *       - SavedRecipe
 *     summary: Сохранить рецепт
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
 *               $ref: '#/components/schemas/SavedRecipe'
 *       400:
 *         description: Invalid Input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.post('/', common_service_1.authMiddleware, savedRecipeController_1.createSavedRecipe);
/**
 * @openapi
 * /saved-recipe/{id}:
 *   get:
 *     tags:
 *       - SavedRecipe
 *     summary: Сохраненный рецепт
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID сохраненного рецепта
 *     responses:
 *       200:
 *         description: Successful Response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavedRecipe'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access Denied
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', common_service_1.authMiddleware, savedRecipeController_1.getSavedRecipe);
/**
 * @openapi
 * /saved-recipe/{id}:
 *   put:
 *     tags:
 *       - SavedRecipe
 *     summary: Обновить сохраненный рецепт
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID сохраненного рецепта
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated Successfully
 *       400:
 *         description: Invalid Input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access Denied
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.put('/:id', common_service_1.authMiddleware, savedRecipeController_1.updateSavedRecipe);
/**
 * @openapi
 * /saved-recipe/{id}:
 *   delete:
 *     tags:
 *       - SavedRecipe
 *     summary: Удалить сохраненный рецепт
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID сохраненного рецепта
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
router.delete('/:id', common_service_1.authMiddleware, savedRecipeController_1.deleteSavedRecipe);
exports.default = router;
