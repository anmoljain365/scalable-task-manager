# 🧠 Scalable Task Management System

A Trello-like task management platform designed to demonstrate **system design**, **scalability**, and **modern DevOps principles** using the **MERN stack** with microservices, Docker, Redis, RabbitMQ, and PostgreSQL.

---

## 🚀 Features

- 🔐 User Authentication (JWT-based, with admin roles)
- 📋 Task Management (Create, update, view, assign tasks)
- 🔔 Asynchronous Notifications via RabbitMQ
- ⚡ Redis caching for high-performance task reads
- 🌍 Microservices Architecture (User, Task, Notification)
- 🐳 Fully containerized with Docker & Docker Compose
- 🧱 PostgreSQL for relational task/user data
- 📦 MongoDB for flexible notification storage
- 📬 RabbitMQ for async communication
- 🛡️ API Gateway for unified routing

---

## 🧱 Architecture

```plaintext
                       ┌──────────────┐
                       │   Web App    │
                       │ (React + TS) │
                       └──────┬───────┘
                              │
                       ┌──────▼───────┐
                       │ API Gateway  │
                       └┬────┬────────┘
                        │    │    
        ┌───────────────▼┐  ┌▼─────────────┐
        │ user-service   │  │ task-service │
        └─────┬──────────┘  └─────┬────────┘
              │                   │
         ┌────▼─────┐        ┌────▼─────┐
         │PostgreSQL│        │ Redis    │
         └──────────┘        └──────────┘
                                   │
                        ┌──────────▼────────────┐
                        │ notification-service  │
                        └─────────┬─────────────┘
                                  │
                            ┌─────▼───────┐
                            │  MongoDB    │
                            └─────────────┘

```

### Running services
- All services: npm run dev
- Individual services: npm run dev --workspace=user-service

### Installing dependencies at service level
- Dependencies: npm install express cors helmet dotenv
- Dev Dependencies: npm install --save-dev @types/express @types/cors @types/node @types/helmet ts-node typescript

### Any changes in postgresql db
#### Initial setup
- npx prisma migrate dev --name init

#### Later schema changes
- npx prisma migrate dev --name add-user-profile

#### For fast prototyping (avoid this)
- npx prisma db push

#### Reseting prisma
- npx prisma migrate reset

### Restting everything and clearning cache
- rm -rf node_modules
- rm -rf apps/*/node_modules
- rm -rf apps/*/prisma/migrations
- rm -rf apps/*/.prisma
- rm -rf .turbo
- rm -rf package-lock.json
- npm install

### Redis cache
## Flushing/Resetting 
- redis-cli FLUSHALL

#### Getting all keys
- redis-cli keys *

### Docker
#### Build image
- docker build -t task-service .   

#### Run image
- docker run -p 4002:4002 --env-file .env task-service

### Docker compose
- docker-compose build: Build all images
- docker-compose up: Start all services with logs
- docker-compose up --build: Build + start (recommended)
- docker-compose up -d: Start in background (detached)
- docker-compose down: Stop and clean up all services