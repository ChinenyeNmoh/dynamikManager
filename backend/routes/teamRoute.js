import express from 'express';
import {protect, ensureNotUser, validateId} from '../middleware/authMiddleware.js';
const router = express.Router();

import { createTeam, getAllTeams, getTeam, updateTeam, deleteTeam  } from '../controllers/teamController.js';

router.get('/', protect,  getAllTeams);

router.post('/', protect, ensureNotUser, createTeam);

router.put('/:id', protect, ensureNotUser, validateId, updateTeam);

router.delete('/:id', protect, ensureNotUser, validateId, deleteTeam);

router.get('/:id', protect, validateId, getTeam);

export default router;
