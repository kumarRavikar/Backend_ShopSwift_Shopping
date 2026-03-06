import express from 'express'
import { forgotPassword, login, logout, register, reVerification, verify } from '../Controllers/userController.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';
const routes = express.Router();
routes.post('/register',register);
routes.post('/verify', verify)
routes.post('/reverify', reVerification)
routes.post('/login',login)
routes.post('/logout',isAuthenticated,logout)
routes.post('/forgotpassword',forgotPassword)
export default routes