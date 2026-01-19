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
exports.deleteLike = exports.getLike = exports.getLikes = exports.createLike = exports.getOwnLikes = exports.getLikesByUser = exports.getLikesByRecipe = void 0;
const database_1 = require("../config/database");
const Like_1 = require("../models/Like");
const common_service_1 = require("common-service");
const likeRepository = database_1.AppDataSource.getRepository(Like_1.Like);
const getLikesByRecipe = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const recipeId = Number(req.params.recipeId);
        if (!Number.isInteger(recipeId)) {
            res.status(400).json({ message: 'Invalid recipeId' });
            return;
        }
        const likes = yield likeRepository.find({
            where: { recipeId },
            order: { created_at: 'ASC' },
        });
        res.json(likes);
    });
};
exports.getLikesByRecipe = getLikesByRecipe;
const getLikesByUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = Number(req.params.userId);
        if (!Number.isInteger(userId)) {
            res.status(400).json({ message: 'Invalid userId' });
            return;
        }
        if (!(yield (0, common_service_1.userExists)(userId))) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const likes = yield likeRepository.find({
            where: { userId },
            order: { created_at: 'ASC' },
        });
        res.json(likes);
    });
};
exports.getLikesByUser = getLikesByUser;
const getOwnLikes = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user.userId;
        const likes = yield likeRepository.find({
            where: { userId },
            order: { created_at: 'ASC' },
        });
        res.json(likes);
    });
};
exports.getOwnLikes = getOwnLikes;
const createLike = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const actor = req.user;
        const { recipeId, userId } = req.body;
        const authorId = actor.role === 'admin' && Number.isInteger(userId) ? userId : actor.userId;
        if (!Number.isInteger(recipeId)) {
            res.status(400).json({ message: 'Invalid recipeId' });
            return;
        }
        if (!Number.isInteger(authorId)) {
            res.status(400).json({ message: 'Invalid userId' });
            return;
        }
        if (!(yield (0, common_service_1.userExists)(authorId))) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (!(yield (0, common_service_1.recipeExists)(recipeId))) {
            res.status(404).json({ message: 'Recipe not found' });
            return;
        }
        const existing = yield likeRepository.findOneBy({ userId: authorId, recipeId });
        if (existing) {
            res.status(400).json({ message: 'Recipe already liked by user' });
            return;
        }
        const like = likeRepository.create({ userId: authorId, recipeId });
        const saved = yield likeRepository.save(like);
        try {
            yield (0, common_service_1.sendMessage)({
                event: 'like.created',
                likeId: saved.id,
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
exports.createLike = createLike;
const getLikes = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const actor = req.user;
        const likes = yield likeRepository.find({
            where: actor.role !== 'admin' ? { userId: actor.userId } : {},
            order: { created_at: 'ASC' },
        });
        res.json(likes);
    });
};
exports.getLikes = getLikes;
const getLike = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({ message: 'Invalid like ID' });
            return;
        }
        const like = yield likeRepository.findOneBy({ id });
        if (!like) {
            res.status(404).json({ message: 'Like not found' });
            return;
        }
        res.json(like);
    });
};
exports.getLike = getLike;
const deleteLike = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const actor = req.user;
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({ message: 'Invalid like ID' });
            return;
        }
        const like = yield likeRepository.findOneBy({ id });
        if (!like) {
            res.status(404).json({ message: 'Like not found' });
            return;
        }
        if (actor.role !== 'admin' && like.userId !== actor.userId) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        yield likeRepository.delete({ id });
        try {
            yield (0, common_service_1.sendMessage)({
                event: 'like.deleted',
                likeId: id,
                userId: like.userId,
                recipeId: like.recipeId,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Failed to send message to RabbitMQ:', error);
        }
        res.status(204).send();
    });
};
exports.deleteLike = deleteLike;
