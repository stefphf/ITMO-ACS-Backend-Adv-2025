import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { AppDataSource } from './config/database';
import commentRouter from './routers/commentRouter';
import likeRouter from './routers/likeRouter';
import savedRecipeRouter from './routers/savedRecipeRouter';
import subscriptionRouter from './routers/subscriptionRouter';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './swagger';
import { errorHandler, connectRabbitMQ, consumeMessages } from 'common-service';

const app = express();
const PORT = 3002;
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(express.json());
app.use(cors());
app.options('*', cors());

const handler = (_request: Request, response: Response) => {
    response.status(200).send({
        message: 'Social Service!',
    });
};

app.get('/', handler);
app.use(errorHandler);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/comment', commentRouter);
app.use('/like', likeRouter);
app.use('/saved-recipe', savedRecipeRouter);
app.use('/subscription', subscriptionRouter);

AppDataSource
.initialize()
.then(async () => {
    console.log('Database connected');

    try {
        await connectRabbitMQ();
        await consumeMessages((message: any) => {
            console.log(`[Social Service] Event received: ${message.event}`, message);
            if (message.event === 'user.deleted' && message.userId) {
                console.log(`[Social Service] User ${message.userId} deleted - should clean up likes, comments, subscriptions`);
            }
            if (message.event === 'recipe.deleted' && message.recipeId) {
                console.log(`[Social Service] Recipe ${message.recipeId} deleted - should clean up likes, comments, saved recipes`);
            }
        });
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log('Server is running on port: ' + PORT);
        console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
    });
})
.catch((error) => console.log(error));
