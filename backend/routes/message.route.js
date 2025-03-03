import express from 'express';
import {ProtectedRoute} from '../middleware/auth.middleware.js'
import {getUsersForSidebar,sendMessage,getMessages} from '../controllers/message.controller.js'
const router = express.Router();

router.get('/users',ProtectedRoute,getUsersForSidebar)
router.get('/:id',ProtectedRoute,getMessages);
router.post('/send/:id',ProtectedRoute,sendMessage);
export default router