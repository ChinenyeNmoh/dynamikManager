import express from 'express';
import {protect, ensureGuest, validateId, ensureAdmin} from '../middleware/authMiddleware.js';
import {
    loginUser, 
    verifyToken, 
    registerUser, 
    forgotPassword, 
    resetPassword, 
    updatePassword, 
    logOut ,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    getUserById,
    deleteUser

} from '../controllers/userController.js';
import { limiter } from '../utils/mail.js';
    
const router = express.Router();


router.post('/register', ensureGuest, registerUser);
router.post('/forgotpassword', ensureGuest, limiter, forgotPassword);
router.post('/login', ensureGuest, loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/users', protect,  getAllUsers);
router.get('/logout', protect, logOut);
router.get('/:id', protect,  getUserById);
router.get("/resetpassword/:id/:token", ensureGuest, validateId, resetPassword);
router.get('/verify/:id/:token', validateId, verifyToken);
router.put("/updatepassword", ensureGuest,  updatePassword);

router.put('/:id', protect, updateUserProfile);

router.delete('/:id', protect, ensureAdmin, deleteUser);



export default router;