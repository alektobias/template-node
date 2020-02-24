import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import AuthMiddleware from './app/middlewares/Auth';
import SessionValidation from './app/validators/SessionValidation';
import UserValidator from './app/validators/UserValidator';

const routes = new Router();

routes
	.route('/')
	.get((req, res) => res.json({ msg: 'Everything is running fine!' }));

routes
	.route('/users')
	.post(UserValidator.store, UserController.store)
	.put(AuthMiddleware, UserValidator.update, UserController.update);

routes.route('/session').post(SessionValidation.store, SessionController.store);

export default routes;
