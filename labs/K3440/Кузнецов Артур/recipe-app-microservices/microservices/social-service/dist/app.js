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
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const commentRouter_1 = __importDefault(require("./routers/commentRouter"));
const likeRouter_1 = __importDefault(require("./routers/likeRouter"));
const savedRecipeRouter_1 = __importDefault(require("./routers/savedRecipeRouter"));
const subscriptionRouter_1 = __importDefault(require("./routers/subscriptionRouter"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./swagger");
const common_service_1 = require("common-service");
const app = (0, express_1.default)();
const PORT = 3002;
const swaggerSpec = (0, swagger_jsdoc_1.default)(swagger_1.swaggerOptions);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.options('*', (0, cors_1.default)());
const handler = (_request, response) => {
    response.status(200).send({
        message: 'Social Service!',
    });
};
app.get('/', handler);
app.use(common_service_1.errorHandler);
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use('/comment', commentRouter_1.default);
app.use('/like', likeRouter_1.default);
app.use('/saved-recipe', savedRecipeRouter_1.default);
app.use('/subscription', subscriptionRouter_1.default);
database_1.AppDataSource
    .initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Database connected');
    try {
        yield (0, common_service_1.connectRabbitMQ)();
        yield (0, common_service_1.consumeMessages)((message) => {
            console.log(`[Social Service] Event received: ${message.event}`, message);
            // Обработка событий от других сервисов
            if (message.event === 'user.deleted' && message.userId) {
                console.log(`[Social Service] User ${message.userId} deleted - should clean up likes, comments, subscriptions`);
                // Здесь можно добавить логику очистки связанных данных
            }
            if (message.event === 'recipe.deleted' && message.recipeId) {
                console.log(`[Social Service] Recipe ${message.recipeId} deleted - should clean up likes, comments, saved recipes`);
                // Здесь можно добавить логику очистки связанных данных
            }
        });
    }
    catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
    app.listen(PORT, () => {
        console.log('Server is running on port: ' + PORT);
        console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
    });
}))
    .catch((error) => console.log(error));
