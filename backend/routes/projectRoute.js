import express from 'express';
import {protect,  validateId, ensureAdmin, ensureNotUser} from '../middleware/authMiddleware.js';
const router = express.Router();

import { createProject, getAllProjects, getProject, updateProject, deleteProject  } from '../controllers/projectController.js';

router.get('/', protect,  getAllProjects);

router.post('/', protect, ensureNotUser, createProject);

router.put('/:id', protect, ensureNotUser, validateId, updateProject);

router.delete('/:id', protect, ensureAdmin, validateId, deleteProject);

router.get('/:id', protect, validateId, getProject);

export default router;
