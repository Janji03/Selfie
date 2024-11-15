import express from 'express';
import { getUserById, updateUserById, updateUserPfpByID, deleteUserById } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUserById);
router.put('/:id/pfp', protect, upload.single('profilePicture'), updateUserPfpByID);
router.delete('/:id', protect, deleteUserById);

export default router;