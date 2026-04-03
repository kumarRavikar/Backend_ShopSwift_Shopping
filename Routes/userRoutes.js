import express from 'express'
import { allUsers, changePassword, forgotPassword, getUserById, login, logout, register, reVerification, updateUser, verify, verifyOTP } from '../Controllers/userController.js';
import { isAdmin, isAuthenticated } from '../middleware/auth.middleware.js';
import { singleUpload } from '../middleware/multer.js';
const routes = express.Router();
routes.post('/register',register);
routes.post('/verify', verify)
routes.post('/reverify', reVerification)
routes.post('/login',login)
routes.post('/logout',isAuthenticated,logout)
routes.post('/forgotpassword',forgotPassword)
routes.post("/verifyOTP/:email", verifyOTP)
routes.post("/changePassword/:email", changePassword)
routes.get("/allusers",isAuthenticated ,isAdmin ,allUsers)
routes.get("/get-user/:userId", getUserById)
routes.put("/update/:id", isAuthenticated, singleUpload, updateUser)
export default routes;