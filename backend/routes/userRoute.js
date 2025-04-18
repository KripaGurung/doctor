import express from 'express';
import { addUser, forgotPassword, loginUser, resetPassword, bookAppointment, listAppointment, listRequestedAppointments, cancelAppointment, getProfile } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/addUser', addUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile',authUser, getProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.post('/forgot-password',forgotPassword);
userRouter.post('/reset-password/:token',resetPassword);
userRouter.get('/appointments', authUser, listAppointment)
userRouter.get('/requested-appointments', authUser, listRequestedAppointments)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/cancel-requested-appointment', authUser, cancelAppointment)
userRouter.post('/book-appointment', authUser, bookAppointment);

export default userRouter;