import express from 'express'
import { userLogin, userSignup, userLogout} from '../controllers/account.controller.js';

const userRouter= express.Router();

userRouter.post('/Login', userLogin)
userRouter.post('/Signup', userSignup)
userRouter.post('/logout', userLogout)

export default userRouter;