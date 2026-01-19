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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRabbitMQ = connectRabbitMQ;
exports.sendMessage = sendMessage;
exports.consumeMessages = consumeMessages;
const amqplib_1 = __importDefault(require("amqplib"));
const QUEUE_NAME = 'recipe.events';
let channel = null;
function tryConnect(rabbitmqUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield amqplib_1.default.connect(rabbitmqUrl);
        channel = yield connection.createChannel();
        yield channel.assertQueue(QUEUE_NAME, { durable: false });
        console.log('RabbitMQ connected');
    });
}
function connectRabbitMQ() {
    return __awaiter(this, void 0, void 0, function* () {
        const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
        const maxRetries = 10;
        const delayMs = 2000;
        for (let i = 1; i <= maxRetries; i++) {
            try {
                yield tryConnect(rabbitmqUrl);
                return;
            }
            catch (err) {
                console.warn(`RabbitMQ connect attempt ${i} failed, retrying in ${delayMs}ms...`, err.message);
                yield new Promise(r => setTimeout(r, delayMs));
            }
        }
        throw new Error('Failed to connect to RabbitMQ after multiple attempts');
    });
}
function sendMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!channel) {
            throw new Error('RabbitMQ channel is not initialized');
        }
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
    });
}
function consumeMessages(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!channel) {
            throw new Error('RabbitMQ channel is not initialized');
        }
        yield channel.consume(QUEUE_NAME, (msg) => {
            if (!msg)
                return;
            const content = JSON.parse(msg.content.toString());
            callback(content);
            channel.ack(msg);
        });
    });
}
