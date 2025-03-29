# Running services
All services: npm run dev
Individual services: npm run dev --workspace=user-service

# Installing dependencies at service level
Dependencies: npm install express cors helmet dotenv
Dev Dependencies: npm install --save-dev @types/express @types/cors @types/node @types/helmet ts-node typescript

# Any changes in postgresql db
## Initial setup
npx prisma migrate dev --name init

## Later schema changes
npx prisma migrate dev --name add-user-profile

## For fast prototyping (avoid this)
npx prisma db push

## Reseting prisma
npx prisma migrate reset

# Restting everything and clearning cache
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf apps/*/prisma/migrations
rm -rf apps/*/.prisma
rm -rf .turbo
rm -rf package-lock.json
npm install

# Redis cache
## Flushing/Resetting 
redis-cli FLUSHALL

## Getting all keys
redis-cli keys *