#!/bin/sh

echo "⏳ Waiting for RabbitMQ to be ready..."

until nc -z rabbitmq 5672; do
  echo "❌ RabbitMQ not available yet..."
  sleep 1
done

echo "✅ RabbitMQ is ready!"

echo "⏳ Waiting for Postgres to be ready..."
until nc -z postgres 5432; do
  echo "❌ Postgres not available yet..."
  sleep 1
done
echo "✅ Postgres is ready!"

echo "⚙️ Generating Prisma client..."
npx prisma generate

echo "📦 Running Prisma migration on taskdb..."
npx prisma migrate deploy

# Start the app
npx ts-node-dev --respawn src/server.ts