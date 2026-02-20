import express from 'express'
import { register, verify } from '../Controllers/userController.js';
const routes = express.Router();
routes.post('/register',register);
routes.post('/verify', verify)
export default routes