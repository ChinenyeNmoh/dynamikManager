import express from 'express';
import {protect,  validateId} from '../middleware/authMiddleware.js';
const router = express.Router();

import {  getAllMessages, getMessageById, deleteMessage,   getUserMessages, updateMessageToRead } from '../controllers/messageController.js';

router.get('/', protect,  getAllMessages);
router.get('/user', protect,  getUserMessages);
router.put('/read', protect,   updateMessageToRead);
router.get('/:id', protect, validateId, getMessageById);
router.delete('/:id', protect, validateId, deleteMessage);



export default router;
