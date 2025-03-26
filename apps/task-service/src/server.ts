import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import taskRoutes from './routes/task.routes';
import path from 'path';

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
app.listen(PORT, () => console.log(`Task Service running on port ${PORT}`));
