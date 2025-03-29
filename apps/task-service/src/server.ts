import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import taskRoutes from './routes/task.routes';
import path from 'path';import { redisClient } from './redis';
import { connectRabbitMQ } from './rabbitmq';

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/task', taskRoutes);

app.get('/', (req: Request, res: Response) => {
    try {
        res.send('Task Service is running');
    } catch (err) {
        res.status(400).send(err);
    }
})

const PORT = process.env.PORT || 4002;

async function startServer() {
  try {
    // Connect Redis
    await redisClient.connect();

    // Connect RabbitMQ
    await connectRabbitMQ();

    // Start the server only after both are ready
    app.listen(PORT, () => console.log(`🚀 Task Service running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Error during startup:', err);
    process.exit(1);
  }
}

startServer();