#!/bin/sh

echo "⏳ Waiting for RabbitMQ to be ready..."

until nc -z rabbitmq 5672; do
  echo "❌ RabbitMQ not available yet..."
  sleep 1
done

echo "✅ RabbitMQ is ready!"

# Start the app
npx ts-node-dev --respawn src/server.ts
