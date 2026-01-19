import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { AppDataSource } from './config/database';
import ingredientRouter from './routers/ingredientRouter';
import dishTypeRouter from './routers/dishTypeRouter';
import recipeDifficultyRouter from './routers/recipeDifficultyRouter';
import recipeIngredientRouter from './routers/recipeIngredientRouter';
import recipeRouter from './routers/recipeRouter';
import recipeStepRouter from './routers/recipeStepRouter';
import { initializeDishTypes } from './services/initDishTypeService';
import { initializeRecipeDifficulties } from './services/initRecipeDifficultyService';
import { initializeIngredients } from './services/initIngredientService';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './swagger';
import { connectRabbitMQ, consumeMessages, errorHandler } from 'common-service';

const app = express();
const PORT = 3001;
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(express.json());
app.use(cors());
app.options('*', cors());

const handler = (_request: Request, response: Response) => {
    response.status(200).send({
        message: 'Recipe Service!',
    });
};

app.get('/', handler);
app.use(errorHandler);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/dish-type', dishTypeRouter);
app.use('/ingredient', ingredientRouter);
app.use('/recipe-difficulty', recipeDifficultyRouter);
app.use('/recipe-ingredient', recipeIngredientRouter);
app.use('/recipe', recipeRouter);
app.use('/recipe-step', recipeStepRouter);

AppDataSource
.initialize()
.then(async () => {
    console.log('Database connected');

    await initializeDishTypes();
    await initializeRecipeDifficulties();
    await initializeIngredients();

    try {
        await connectRabbitMQ();
        await consumeMessages((message: any) => {
            console.log(`[Recipe Service] Event received: ${message.event}`, message);
            if (message.event === 'user.deleted' && message.userId) {
                console.log(`[Recipe Service] User ${message.userId} deleted - should clean up related recipes`);
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
