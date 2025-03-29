import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectRabbitMQ, getChannel } from './rabbitmq';

dotenv.config();
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    try {
        res.send('Notification Service is running');
    } catch (err) {
        res.status(400).send(err);
    }
})

const PORT = process.env.PORT || 4003;

async function startServer() {
    try {
        // Mongo DB connect
        await mongoose.connect(process.env.MONGO_URI!)
            .then(() => console.log('MongoDB connected'))
            .catch((err) => console.error('MongoDB connection error:', err));

        // Connect RabbitMQ
        await connectRabbitMQ();
        // Getting notification when task is created and sending a message to user
        const channel = getChannel();
        channel.assertQueue('task_created');
        channel.consume('task_created', (msg) => {
            if (msg) {
                const data = JSON.parse(msg.content.toString());
                console.log('📨 Notification Received:', data);

                // Placeholder: send email or push notification here

                channel.ack(msg); // mark as handled
            }
        });

        // Start the server only after both are ready
        app.listen(PORT, () => console.log(`🚀 Task Service running on port ${PORT}`));
    } catch (err) {
        console.error('❌ Error during startup:', err);
        process.exit(1);
    }
}

startServer();
