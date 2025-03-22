import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// Mongo DB connect
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req: Request, res: Response) => {
    try {
        res.send('Notification Service is running');
    } catch (err) {
        res.status(400).send(err);
    }
})

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => console.log(`Notification Service running on port ${PORT}`));
