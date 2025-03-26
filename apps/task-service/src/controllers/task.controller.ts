import { Request, Response } from 'express';
import { prisma } from '../prisma';

// 🧾 GET /task - Get all tasks for the logged-in user
export const getTasks = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const tasks = await prisma.task.findMany({
      where: {
        assignedTo: user.userId,
      },
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// ➕ POST /task - Create a new task assigned to self or someone else
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
