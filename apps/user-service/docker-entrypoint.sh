#!/bin/sh

echo "⏳ Waiting for Postgres to be ready..."

until nc -z postgres 5432; do
  sleep 1
done

echo "✅ Postgres is up – running Prisma migration..."

npx prisma generate
npx prisma migrate deploy

echo "🚀 Starting user-service with ts-node-dev..."

npx ts-node-dev --respawn src/server.ts