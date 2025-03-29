import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { redisClient } from '../redis';

// 🧾 GET /task - Get all tasks for the logged-in user
// Using redis for faster reads
export const getTasks = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const cacheKey = `tasks:user:${user.userId}`;

  try {
    // Try Redis first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Fallback to DB
    const tasks = await prisma.task.findMany({
      where: {
        assignedTo: user.userId,
      },
    });

    // Save to Redis (TTL: 60s)
    await redisClient.set(cacheKey, JSON.stringify(tasks), { EX: 60 });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// ➕ POST /task - Create a new task assigned to self or someone else
// Delete cache once new tasks are created
export const createTask = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { title, description, assignedTo } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: 'todo',
        createdAt: new Date(),
        assignedTo: assignedTo || user.userId,
      },
    });

    // Deleting cache for that user once new tasks are created
    await redisClient.del(`tasks:user:${user.userId}`);

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// ❌ DELETE /task/:id - Only Admins can delete tasks
export const deleteTask = async (req: Request, res: Response) => {
  const taskId = req.params.id;

  try {
    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
