import express from 'express';
import { login, logout, signup,updateProfile,checkAuth } from '../controllers/auth.controller.js';
import {ProtectedRoute} from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);
router.put('/updateprofile',ProtectedRoute,updateProfile);
router.get('/checkAuth',ProtectedRoute,checkAuth);

export default router;