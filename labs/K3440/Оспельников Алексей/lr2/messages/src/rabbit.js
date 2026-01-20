const amqp = require('amqplib');

let channel;

async function connectRabbit() {
  const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
  channel = await connection.createChannel();

  await channel.assertQueue('tasks', { durable: true });

  console.log('RabbitMQ connected');
}

function getChannel() {
  if (!channel) throw new Error('RabbitMQ channel not initialized');
  return channel;
}

module.exports = { connectRabbit, getChannel };
    