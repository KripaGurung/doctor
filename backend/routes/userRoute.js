import express from 'express';
import { addUser, forgotPassword, loginUser, resetPassword } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/addUser', addUser);
userRouter.post('/login', loginUser);
userRouter.post('/forgot-password',forgotPassword);
userRouter.post('/reset-password/:token',resetPassword);

export default userRouter;