import express from 'express';
import { addUser, loginUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/addUser', addUser);
userRouter.post('/login', loginUser);

export default userRouter;