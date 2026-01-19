import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { AppDataSource } from './config/database';
import userRouter from './routers/userRouter';
import authRouter from './routers/authRouter';
import roleRouter from './routers/roleRouter';
import { initializeRoles } from './services/initRoleService';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './swagger';
import { connectRabbitMQ, consumeMessages, errorHandler } from 'common-service';

const app = express();
const PORT = 3000;
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(express.json());
app.use(cors());
app.options('*', cors());

const handler = (_request: Request, response: Response) => {
    response.status(200).send({
        message: 'Auth Service!',
    });
};

app.get('/', handler);
app.use(errorHandler);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/role', roleRouter);

AppDataSource
.initialize()
.then(async () => {
    console.log('Database connected');

    await initializeRoles();

    try {
        await connectRabbitMQ();
        await consumeMessages((message: any) => {
            console.log(`[Auth Service] Event received: ${message.event}`, message);
        });
    } catch (error) {
        console.error('RabbitMQ is required. Shutting down...', error);
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log('Server is running on port: ' + PORT);
        console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
    });
})
.catch((error) => console.log(error));
