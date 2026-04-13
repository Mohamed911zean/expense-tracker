import express from 'express'
import protect from '../middlewares/authMiddleware.js'

import { registerUser, LoginUser, UserInfo } from '../controllers/authController.js'

const router = express.Router()

router.post('/register' , registerUser)
router.post('/login' , LoginUser)
router.get('/user-info' , protect , UserInfo)

export default router