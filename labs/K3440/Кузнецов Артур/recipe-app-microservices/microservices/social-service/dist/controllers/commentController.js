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
exports.deleteComment = exports.updateComment = exports.createComment = exports.getCommentsByUser = exports.getOwnComments = exports.getCommentsByRecipe = void 0;
const database_1 = require("../config/database");
const Comment_1 = require("../models/Comment");
const common_service_1 = require("common-service");
const commentRepository = database_1.AppDataSource.getRepository(Comment_1.Comment);
const getCommentsByRecipe = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const recipeId = Number(req.params.recipeId);
        if (!Number.isInteger(recipeId)) {
            res.status(400).json({ message: 'Invalid recipeId' });
            return;
        }
        const comments = yield commentRepository.find({
            where: { recipeId },
            order: { created_at: 'ASC' },
        });
        res.json(comments);
    });
};
exports.getCommentsByRecipe = getCommentsByRecipe;
const getOwnComments = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user.userId;
        const comments = yield commentRepository.find({
            where: { userId },
            order: { created_at: 'ASC' },
        });
        res.json(comments);
    });
};
exports.getOwnComments = getOwnComments;
const getCommentsByUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = Number(req.params.userId);
        if (!Number.isInteger(userId)) {
            res.status(400).json({ message: 'Invalid userId' });
            return;
        }
        const exists = yield (0, common_service_1.userExists)(userId);
        if (!exists) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const comments = yield commentRepository.find({
            where: { userId },
            order: { created_at: 'ASC' },
        });
        res.json(comments);
    });
};
exports.getCommentsByUser = getCommentsByUser;
const createComment = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const actor = req.user;
        const recipeId = Number(req.params.recipeId);
        const { content, userId } = req.body;
        if (!Number.isInteger(recipeId)) {
            res.status(400).json({ message: 'Invalid recipeId' });
            return;
        }
        if (!(content === null || content === void 0 ? void 0 : content.trim())) {
            res.status(400).json({ message: 'Content cannot be empty' });
            return;
        }
        const authorId = actor.role === 'admin' && Number.isInteger(userId)
            ? userId
            : actor.userId;
        if (!(yield (0, common_service_1.userExists)(authorId))) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (!(yield (0, common_service_1.recipeExists)(recipeId))) {
            res.status(404).json({ message: 'Recipe not found' });
            return;
        }
        const newComment = commentRepository.create({
            userId: authorId,
            recipeId,
            content: content.trim(),
        });
        const saved = yield commentRepository.save(newComment);
        try {
            yield (0, common_service_1.sendMessage)({
                event: 'comment.created',
                commentId: saved.id,
                userId: saved.userId,
                recipeId: saved.recipeId,
                content: saved.content,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Failed to send message to RabbitMQ:', error);
        }
        res.status(201).json(saved);
    });
};
exports.createComment = createComment;
const updateComment = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const actor = req.user;
        const id = Number(req.params.id);
        const { content } = req.body;
        if (!Number.isInteger(id)) {
            res.status(400).json({ message: 'Invalid comment ID' });
            return;
        }
        const comment = yield commentRepository.findOneBy({ id });
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }
        if (actor.role !== 'admin' && comment.userId !== actor.userId) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        if (content !== undefined) {
            if (!content.trim()) {
                res.status(400).json({ message: 'Content cannot be empty' });
                return;
            }
            if (content.length > 1000) {
                res.status(400).json({ message: 'Content too long' });
                return;
            }
            comment.content = content;
        }
        yield commentRepository.save(comment);
        try {
            yield (0, common_service_1.sendMessage)({
                event: 'comment.updated',
                commentId: id,
                userId: comment.userId,
                recipeId: comment.recipeId,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Failed to send message to RabbitMQ:', error);
        }
        res.json(comment);
    });
};
exports.updateComment = updateComment;
const deleteComment = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const actor = req.user;
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).json({ message: 'Invalid comment ID' });
            return;
        }
        const comment = yield commentRepository.findOneBy({ id });
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }
        if (actor.role !== 'admin' && comment.userId !== actor.userId) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        yield commentRepository.delete({ id });
        try {
            yield (0, common_service_1.sendMessage)({
                event: 'comment.deleted',
                commentId: id,
                userId: comment.userId,
                recipeId: comment.recipeId,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Failed to send message to RabbitMQ:', error);
        }
        res.status(204).send();
    });
};
exports.deleteComment = deleteComment;
