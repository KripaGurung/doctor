import express from 'express';
import { addUser, forgotPassword, loginUser, resetPassword,  bookAppointment, listAppointment, cancelAppointment, getProfile } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/addUser', addUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile',authUser, getProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.post('/forgot-password',forgotPassword);
userRouter.post('/reset-password/:token',resetPassword);
userRouter.get('/appointments',authUser ,listAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)

export default userRouter;