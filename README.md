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