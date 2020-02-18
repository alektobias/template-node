import { Router } from 'express';

import UserController from './app/controllers/UserController';
import AuthMiddleware from './app/middlewares/Auth';
import UserValidator from './app/validators/UserValidator';

const routes = new Router();

routes
	.route('/')
	.get((req, res) => res.json({ msg: 'Everything is running fine!' }));

routes
	.route('/users')
	.post(UserValidator.store, UserController.store)
	.put(AuthMiddleware, UserValidator.update, UserController.update);

export default routes;
