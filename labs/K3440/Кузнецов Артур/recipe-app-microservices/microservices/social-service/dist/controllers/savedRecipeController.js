"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSavedRecipe = exports.updateSavedRecipe = exports.getSavedRecipe = exports.getSavedRecipes = exports.createSavedRecipe = void 0;
const database_1 = require("../config/database");
const SavedRecipe_1 = require("../models/SavedRecipe");
const common_service_1 = require("common-service");
const savedRecipeRepository = database_1.AppDataSource.getRepository(SavedRecipe_1.SavedRecipe);
const createSavedRecipe = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const actor = req.user;
        const { recipeId, userId = actor.userId } = req.body;
        if (!Number.isInteger(recipeId)) {
            res.status(400).json({ message: 'Invalid recipeId' });
            return;
        }
        if (!Number.isInteger(userId)) {
            res.status(400).json({ message: 'Invalid userId' });
            return;
        }
        if (actor.role !== 'admin' && userId !== actor.userId) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        if (!(yield (0, common_service_1.userExists)(userId))) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (!(yield (0, common_service_1.recipeExists)(recipeId))) {
            res.status(404).json({ message: 'Recipe not found' });
            return;
        }
        const existing = yield savedRecipeRepository.findOneBy({ userId, recipeId });
        if (existing) {
            res.status(400).json({ message: 'Recipe already saved by user' });
            return;
        }
        const savedRecipe = savedRecipeRepository.create({ userId, recipeId });
        const saved = yield savedRecipeRepository.save(savedRecipe);
        try {
            yield (0, common_service_1.sendMessage)({
                event: 'savedRecipe.created',
                savedRecipeId: saved.id,
                userId: saved.userId,
                recipeId: saved.recipeId,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Failed to send message to RabbitMQ:', error);
        }
        res.status(201).json(saved);
    });
};
exports.createSavedRecipe = createSavedRecipe;
const getSavedRecipes = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const actor = req.user;
        const savedRecipes = yield savedRecipeRepository.find({
            where: actor.role !== 'admin' ? { userId: actor.userId } : {},
            order: { created_at: 'ASC' },
        });
        res.json(savedRecipes);
    });
};
exports.getSavedRecipes = getSavedRecipes;
const getSavedRecipe = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({ message: 'Invalid saved recipe ID' });
            return;
        }
        const savedRecipe = yield savedRecipeRepository.findOneBy({ id });
        if (!savedRecipe) {
            res.status(404).json({ message: 'Saved recipe not found' });
            return;
        }
        res.json(savedRecipe);
    });
};
exports.getSavedRecipe = getSavedRecipe;
const updateSavedRecipe = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const actor = req.user;
        const id = Number(req.params.id);
        const { recipeId } = req.body;
        if (!Number.isInteger(id)) {
            res.status(400).json({ message: 'Invalid saved recipe ID' });
            return;
        }
        if (!Number.isInteger(recipeId)) {
            res.status(400).json({ message: 'Invalid recipeId' });
            return;
        }
        const savedRecipe = yield savedRecipeRepository.findOneBy({ id });
        if (!savedRecipe) {
            res.status(404).json({ message: 'Saved recipe not found' });
            return;
        }
        if (actor.role !== 'admin' && savedRecipe.userId !== actor.userId) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        if (!(yield (0, common_service_1.recipeExists)(recipeId))) {
            res.status(404).json({ message: 'Recipe not found' });
            return;
        }
        const existing = yield savedRecipeRepository.findOneBy({ userId: savedRecipe.userId, recipeId });
        if (existing && existing.id !== id) {
            res.status(400).json({ message: 'Recipe already saved by user' });
            return;
        }
        savedRecipe.recipeId = recipeId;
        yield savedRecipeRepository.save(savedRecipe);
        res.json(savedRecipe);
    });
};
exports.updateSavedRecipe = updateSavedRecipe;
const deleteSavedRecipe = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const actor = req.user;
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({ message: 'Invalid saved recipe ID' });
            return;
        }
        const savedRecipe = yield savedRecipeRepository.findOneBy({ id });
        if (!savedRecipe) {
            res.status(404).json({ message: 'Saved recipe not found' });
            return;
        }
        if (actor.role !== 'admin' && savedRecipe.userId !== actor.userId) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        yield savedRecipeRepository.delete({ id });
        try {
            yield (0, common_service_1.sendMessage)({
                event: 'savedRecipe.deleted',
                savedRecipeId: id,
                userId: savedRecipe.userId,
                recipeId: savedRecipe.recipeId,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Failed to send message to RabbitMQ:', error);
        }
        res.status(204).send();
    });
};
exports.deleteSavedRecipe = deleteSavedRecipe;
