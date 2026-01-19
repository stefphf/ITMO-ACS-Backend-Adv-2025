import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Recipe } from '../models/Recipe';
import { DishType } from '../models/DishType';
import { RecipeDifficulty } from '../models/RecipeDifficulty';
import { AuthRequest, userExists, sendMessage } from 'common-service';
import { Ingredient } from '../models/Ingredient';
import { In } from 'typeorm';

const recipeRepository = AppDataSource.getRepository(Recipe);
const dishTypeRepository = AppDataSource.getRepository(DishType);
const recipeDifficultyRepository = AppDataSource.getRepository(RecipeDifficulty);
const ingredientRepository = AppDataSource.getRepository(Ingredient);

export const createRecipe = async function(req: AuthRequest, res: Response) {
    const actor = req.user!;
    const {
        dishTypeId,
        recipeDifficultyId,
        userId,
        title,
        preparation_time,
        cooking_time,
        servings,
        ...data
    } = req.body;
    const ownerId = actor.role === 'admin' && Number.isInteger(userId) ? userId : actor.userId;

    if (!Number.isInteger(dishTypeId) || !Number.isInteger(recipeDifficultyId) || !Number.isInteger(ownerId)) {
        res.status(400).json({ message: 'Invalid dishTypeId, recipeDifficultyId, or userId' });
        return;
    }
    if (!title || typeof title !== 'string' || title.length > 255) {
        res.status(400).json({ message: 'Invalid or missing title' });
        return;
    }
    if (!Number.isInteger(preparation_time) || preparation_time <= 0) {
        res.status(400).json({ message: 'Invalid preparation_time' });
        return;
    }
    if (!Number.isInteger(cooking_time) || cooking_time <= 0) {
        res.status(400).json({ message: 'Invalid cooking_time' });
        return;
    }
    if (!Number.isInteger(servings) || servings <= 0) {
        res.status(400).json({ message: 'Invalid servings' });
        return;
    }

    if (!await userExists(ownerId)) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    const dishType = await dishTypeRepository.findOneBy({ id: dishTypeId });
    if (!dishType) {
        res.status(404).json({ message: 'Dish type not found' });
        return;
    }
    const recipeDifficulty = await recipeDifficultyRepository.findOneBy({ id: recipeDifficultyId });
    if (!recipeDifficulty) {
        res.status(404).json({ message: 'Recipe difficulty not found' });
        return;
    }

    const recipe = recipeRepository.create({
        userId: ownerId,
        dishType,
        recipeDifficulty,
        title,
        preparation_time,
        cooking_time,
        servings,
        ...data,
    });

    const saved = await recipeRepository.save(recipe);
    
    try {
        await sendMessage({
            event: 'recipe.created',
            recipe: saved,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Failed to send message to RabbitMQ:', error);
    }
    
    res.status(201).json(saved);
};

export const getRecipes = async (req: Request, res: Response) => {
    try {
        const dishTypeId = req.query.dishTypeId ? Number(req.query.dishTypeId) : null;
        const difficultyId = req.query.difficultyId ? Number(req.query.difficultyId) : null;
        const ingredientIds = req.query.ingredientIds
            ? (req.query.ingredientIds as string).split(',').map(id => Number(id)).filter(id => Number.isInteger(id))
            : [];
        const title = (req.query.title as string) || null;

        if (ingredientIds.length > 0) {
            const found = await ingredientRepository.find({ where: { id: In(ingredientIds) } });
            if (found.length !== ingredientIds.length) {
                const foundIds = new Set(found.map(i => i.id));
                const missing = ingredientIds.filter(i => !foundIds.has(i));
                return res.status(404).json({ message: `Ingredient(s) not found: ${missing.join(',')}` });
            }
        }

        let recipeIdsMatchingIngredients: number[] | null = null;
        if (ingredientIds.length > 0) {
            const qbIds = recipeRepository
            .createQueryBuilder('r')
            .leftJoin('r.recipeIngredients', 'ri')
            .leftJoin('ri.ingredient', 'ingredient')
            .where('ingredient.id IN (:...ingredientIds)', { ingredientIds })
            .groupBy('r.id')
            .having('COUNT(DISTINCT ingredient.id) = :count', { count: ingredientIds.length })
            .select('r.id', 'id');

            const rows: { id: number }[] = await qbIds.getRawMany();
            recipeIdsMatchingIngredients = rows.map(row => Number(row.id));

            if (recipeIdsMatchingIngredients.length === 0) {
                return res.json([]);
            }
        }

        const qb = recipeRepository
        .createQueryBuilder('recipe')
        .leftJoinAndSelect('recipe.dishType', 'dishType')
        .leftJoinAndSelect('recipe.recipeDifficulty', 'recipeDifficulty')
        .leftJoinAndSelect('recipe.recipeIngredients', 'ri')
        .leftJoinAndSelect('ri.ingredient', 'ingredient');

        if (dishTypeId) {
            qb.andWhere('dishType.id = :dishTypeId', { dishTypeId });
        }
        if (difficultyId) {
            qb.andWhere('recipeDifficulty.id = :difficultyId', { difficultyId });
        }
        if (title) {
            qb.andWhere('recipe.title ILIKE :title', { title: `%${title}%` });
        }

        if (recipeIdsMatchingIngredients) {
            qb.andWhere('recipe.id IN (:...ids)', { ids: recipeIdsMatchingIngredients });
        }

        const recipes = await qb.getMany();
        return res.json(recipes);
    } catch (err) {
        console.error('getRecipes error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getRecipe = async function(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        res.status(400).json({ message: 'Invalid recipeId' });
        return;
    }

    const recipe = await recipeRepository
    .createQueryBuilder('recipe')
    .leftJoinAndSelect('recipe.dishType', 'dishType')
    .leftJoinAndSelect('recipe.recipeDifficulty', 'recipeDifficulty')
    .leftJoinAndSelect('recipe.recipeIngredients', 'ri')
    .leftJoinAndSelect('ri.ingredient', 'ingredient')
    .leftJoinAndSelect('recipe.steps', 'stepsId')
    .where('recipe.id = :id', { id })
    .getOne();

    if (!recipe) {
        res.status(404).json({ message: 'Recipe not found' });
        return;
    }
    res.json(recipe);
};

export const getOwnRecipes = async function(req: AuthRequest, res: Response) {
    const actor = req.user!;
    const recipes = await recipeRepository
    .createQueryBuilder('recipe')
    .leftJoinAndSelect('recipe.dishType', 'dishType')
    .leftJoinAndSelect('recipe.recipeDifficulty', 'recipeDifficulty')
    .leftJoinAndSelect('recipe.recipeIngredients', 'ri')
    .leftJoinAndSelect('ri.ingredient', 'ingredient')
    .leftJoinAndSelect('recipe.steps', 'stepsId')
    .where('recipe.userId = :userId', { userId: actor.userId })
    .getMany();

    res.json(recipes);
};

export const getRecipesByUser = async function(req: AuthRequest, res: Response) {
    const userId = Number(req.params.userId);
    if (!Number.isInteger(userId)) {
        res.status(400).json({ message: 'Invalid userId' });
        return;
    }

    if (!await userExists(userId)) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    const recipes = await recipeRepository
    .createQueryBuilder('recipe')
    .leftJoinAndSelect('recipe.dishType', 'dishType')
    .leftJoinAndSelect('recipe.recipeDifficulty', 'recipeDifficulty')
    .leftJoinAndSelect('recipe.recipeIngredients', 'ri')
    .leftJoinAndSelect('ri.ingredient', 'ingredient')
    .leftJoinAndSelect('recipe.steps', 'stepsId')
    .where('recipe.userId = :userId', { userId })
    .getMany();

    res.json(recipes);
};

export const updateRecipe = async function(req: AuthRequest, res: Response) {
    const actor = req.user!;
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        res.status(400).json({ message: 'Invalid recipeId' });
        return;
    }

    const body: any = { ...req.body };

    if (body.title && (typeof body.title !== 'string' || body.title.length > 255)) {
        res.status(400).json({ message: 'Invalid title' });
        return;
    }
    if (body.preparation_time && (!Number.isInteger(body.preparation_time) || body.preparation_time <= 0)) {
        res.status(400).json({ message: 'Invalid preparation_time' });
        return;
    }
    if (body.cooking_time && (!Number.isInteger(body.cooking_time) || body.cooking_time <= 0)) {
        res.status(400).json({ message: 'Invalid cooking_time' });
        return;
    }
    if (body.servings && (!Number.isInteger(body.servings) || body.servings <= 0)) {
        res.status(400).json({ message: 'Invalid servings' });
        return;
    }

    if (body.dishTypeId) {
        const dishType = await dishTypeRepository.findOneBy({ id: body.dishTypeId });
        if (!dishType) {
            res.status(404).json({ message: 'Dish type not found' });
            return;
        }
        body.dishType = dishType;
    }
    if (body.recipeDifficultyId) {
        const recipeDifficulty = await recipeDifficultyRepository.findOneBy({ id: body.recipeDifficultyId });
        if (!recipeDifficulty) {
            res.status(404).json({ message: 'Recipe difficulty not found' });
            return;
        }
        body.recipeDifficulty = recipeDifficulty;
    }

    const recipe = await recipeRepository.findOneBy({ id });
    if (!recipe) {
        res.status(404).json({ message: 'Recipe not found' });
        return;
    }
    if (actor.role !== 'admin' && recipe.userId !== actor.userId) {
        res.status(403).json({ message: 'Access denied' });
        return;
    }

    await recipeRepository.update(id, body);
    const updated = await recipeRepository.findOneBy({ id });
    
    try {
        await sendMessage({
            event: 'recipe.updated',
            recipeId: id,
            userId: updated?.userId,
            title: updated?.title,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Failed to send message to RabbitMQ:', error);
    }
    
    res.json(updated);
};

export const deleteRecipe = async function(req: AuthRequest, res: Response) {
    const actor = req.user!;
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        res.status(400).json({ message: 'Некорректный ID рецепта' });
        return;
    }

    const recipe = await recipeRepository.findOneBy({ id });
    if (!recipe) {
        res.status(404).json({ message: 'Recipe not found' });
        return;
    }
    if (actor.role !== 'admin' && recipe.userId !== actor.userId) {
        res.status(403).json({ message: 'Access denied' });
        return;
    }

    await recipeRepository.delete(id);
    
    try {
        await sendMessage({
            event: 'recipe.deleted',
            recipeId: id,
            userId: recipe.userId,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Failed to send message to RabbitMQ:', error);
    }
    
    res.status(204).send();
};
