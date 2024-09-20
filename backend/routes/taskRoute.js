import express from 'express';
import {protect,  validateId, ensureAdmin, ensureNotUser} from '../middleware/authMiddleware.js';
const router = express.Router();

import { createTask, getAllTasks, getTaskById, updateTaskById, deleteTaskById } from '../controllers/taskController.js';

router.get('/', protect,  getAllTasks);

router.post('/', protect, ensureNotUser, createTask);

router.put('/:id', protect,  validateId, updateTaskById);

router.delete('/:id', protect, ensureNotUser, validateId, deleteTaskById);

router.get('/:id', protect, validateId, getTaskById);

export default router;

