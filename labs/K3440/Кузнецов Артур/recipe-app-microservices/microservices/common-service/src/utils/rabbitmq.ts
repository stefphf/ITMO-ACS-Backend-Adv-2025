import amqp, { Channel } from 'amqplib';

const QUEUE_NAME = 'recipe.events';
let channel: Channel | null = null;

async function tryConnect(rabbitmqUrl: string) {
    const connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: false });
    console.log('RabbitMQ connected');
}

export async function connectRabbitMQ(): Promise<void> {
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
    const maxRetries = 10;
    const delayMs = 2000;

    for (let i = 1; i <= maxRetries; i++) {
        try {
            await tryConnect(rabbitmqUrl);
            return;
        } catch (err: any) {
            console.warn(`RabbitMQ connect attempt ${i} failed, retrying in ${delayMs}ms...`, err.message);
            await new Promise(r => setTimeout(r, delayMs));
        }
    }
    throw new Error('Failed to connect to RabbitMQ after multiple attempts');
}

export async function sendMessage(message: any): Promise<void> {
    if (!channel) {
        throw new Error('RabbitMQ channel is not initialized');
    }

    channel.sendToQueue(
        QUEUE_NAME,
        Buffer.from(JSON.stringify(message))
    );
}

export async function consumeMessages(callback: (message: any) => void): Promise<void> {
    if (!channel) {
        throw new Error('RabbitMQ channel is not initialized');
    }

    await channel.consume(QUEUE_NAME, (msg) => {
        if (!msg) return;

        const content = JSON.parse(msg.content.toString());
        callback(content);
        channel!.ack(msg);
    });
}
