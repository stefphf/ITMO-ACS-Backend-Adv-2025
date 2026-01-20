const amqp = require('amqplib');

async function startWorker() {
  const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
  const channel = await connection.createChannel();

  await channel.assertQueue('tasks', { durable: true });
  channel.prefetch(1);

  console.log('Worker waiting for messages...');

  channel.consume('tasks', async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    console.log('Processing:', data);

    await new Promise(r => setTimeout(r, 2000));

    channel.ack(msg);
  });
}

startWorker();
