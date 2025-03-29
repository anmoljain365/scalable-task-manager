import amqp from 'amqplib';

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  channel = await connection.createChannel();
  console.log('✅ Connected to RabbitMQ');
}

export function getChannel(): amqp.Channel {
  if (!channel) throw new Error('RabbitMQ channel not initialized');
  return channel;
}