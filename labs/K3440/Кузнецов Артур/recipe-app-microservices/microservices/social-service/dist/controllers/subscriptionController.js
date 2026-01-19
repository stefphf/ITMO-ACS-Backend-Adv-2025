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
exports.deleteSubscription = exports.getSubscription = exports.getSubscriptions = exports.getOwnFollowers = exports.getOwnFollowing = exports.getFollowersOf = exports.getFollowingOf = exports.createSubscription = void 0;
const database_1 = require("../config/database");
const Subscription_1 = require("../models/Subscription");
const common_service_1 = require("common-service");
const subscriptionRepository = database_1.AppDataSource.getRepository(Subscription_1.Subscription);
const createSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const actor = req.user;
    const { followingId, followerId } = req.body;
    if (!Number.isInteger(followingId)) {
        res.status(400).json({ message: 'Invalid followingId' });
        return;
    }
    const actualFollowerId = actor.role === 'admin' && Number.isInteger(followerId)
        ? followerId
        : actor.userId;
    if (actualFollowerId === followingId) {
        res.status(400).json({ message: 'You cannot subscribe to yourself' });
        return;
    }
    const bothUsersExist = yield Promise.all([
        (0, common_service_1.userExists)(actualFollowerId),
        (0, common_service_1.userExists)(followingId),
    ]);
    if (!bothUsersExist[0] || !bothUsersExist[1]) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    const exists = yield subscriptionRepository.findOneBy({
        followerId: actualFollowerId,
        followingId,
    });
    if (exists) {
        res.status(409).json({ message: 'Subscription already exists' });
        return;
    }
    const sub = subscriptionRepository.create({
        followerId: actualFollowerId,
        followingId,
    });
    const saved = yield subscriptionRepository.save(sub);
    try {
        yield (0, common_service_1.sendMessage)({
            event: 'subscription.created',
            subscriptionId: saved.id,
            followerId: saved.followerId,
            followingId: saved.followingId,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error('Failed to send message to RabbitMQ:', error);
    }
    res.status(201).json(saved);
});
exports.createSubscription = createSubscription;
const getFollowingOf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.userId);
    if (!Number.isInteger(userId)) {
        res.status(400).json({ message: 'Invalid userId' });
        return;
    }
    const list = yield subscriptionRepository.find({
        where: { followerId: userId },
        order: { created_at: 'ASC' },
    });
    res.json(list);
});
exports.getFollowingOf = getFollowingOf;
const getFollowersOf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.userId);
    if (!Number.isInteger(userId)) {
        res.status(400).json({ message: 'Invalid userId' });
        return;
    }
    const subs = yield subscriptionRepository.find({
        where: { followingId: userId },
        order: { created_at: 'ASC' },
    });
    res.json(subs);
});
exports.getFollowersOf = getFollowersOf;
const getOwnFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const list = yield subscriptionRepository.find({
        where: { followerId: userId },
        order: { created_at: 'ASC' },
    });
    res.json(list);
});
exports.getOwnFollowing = getOwnFollowing;
const getOwnFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const list = yield subscriptionRepository.find({
        where: { followingId: userId },
        order: { created_at: 'ASC' },
    });
    res.json(list);
});
exports.getOwnFollowers = getOwnFollowers;
const getSubscriptions = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const all = yield subscriptionRepository.find({
        order: { created_at: 'ASC' },
    });
    res.json(all);
});
exports.getSubscriptions = getSubscriptions;
const getSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }
    const item = yield subscriptionRepository.findOneBy({ id });
    if (!item) {
        res.status(404).json({ message: 'Subscription not found' });
        return;
    }
    res.json(item);
});
exports.getSubscription = getSubscription;
const deleteSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }
    const actor = req.user;
    const sub = yield subscriptionRepository.findOneBy({ id });
    if (!sub) {
        res.status(404).json({ message: 'Subscription not found' });
        return;
    }
    if (actor.role !== 'admin' && sub.followerId !== actor.userId) {
        res.status(403).json({ message: 'Access denied' });
        return;
    }
    yield subscriptionRepository.delete({ id });
    try {
        yield (0, common_service_1.sendMessage)({
            event: 'subscription.deleted',
            subscriptionId: id,
            followerId: sub.followerId,
            followingId: sub.followingId,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error('Failed to send message to RabbitMQ:', error);
    }
    res.status(204).send();
});
exports.deleteSubscription = deleteSubscription;
