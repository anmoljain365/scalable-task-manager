import { Router } from 'express';
import { getTasks, createTask, deleteTask, updateTask } from '../controllers/task.controller';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/', requireAuth(), getTasks);                   // Get all tasks (auth required)
router.post('/', requireAuth(), createTask);                // Create task (auth required)
router.put('/:id', requireAuth(), updateTask);
router.delete('/:id', requireAuth(['admin']), deleteTask);  // Delete (admin only)

export default router;