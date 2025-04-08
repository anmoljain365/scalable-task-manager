import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { redisClient } from '../redis';
import { getChannel } from '../rabbitmq';

// 🧾 GET /task - Get all tasks for the logged-in user
// Using redis for faster reads
export const getTasks = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const cacheKey = `tasks:user:${user.userId}`;

  try {
    // Try Redis first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }

    // Fallback to DB
    const tasks = await prisma.task.findMany({
      where: {
        assignedTo: user.userId,
      },
      orderBy: { updatedAt: 'desc' },
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

    // Sending task create notification to notification-service
    // Channel to notification service
    const channel = getChannel();
    channel.assertQueue('task_created');
    channel.sendToQueue('task_created', Buffer.from(JSON.stringify({
      title,
      description,
      userId: user.userId
    })));

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// ➕ PUT /task - Update a task assigned to self or someone else
// Delete cache once new tasks are created
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        updatedAt: new Date(), // optional, Prisma handles this if you use @updatedAt
      },
    });

    // Deleting cache for that user once new tasks are created
    await redisClient.del(`tasks:user:${id}`);

    // Sending task create notification to notification-service
    // Channel to notification service
    const channel = getChannel();
    channel.assertQueue('task_created');
    channel.sendToQueue('task_created', Buffer.from(JSON.stringify({
      title,
      description,
      userId: id
    })));

    res.status(200).json(task);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
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
