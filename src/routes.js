import { Router } from 'express';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import AuthMiddleware from './app/middlewares/Auth';
import SessionValidation from './app/validators/SessionValidation';
import UserValidator from './app/validators/UserValidator';
import redisConfig from './config/redis';

const routes = new Router();

const bruteStore = new BruteRedis(redisConfig);
const bruteForce = new Brute(bruteStore, {
	freeRetries: 5,
	minWait: 30 * 1000, // 30 segundos
	maxWait: 24 * 60 * 60 * 1000, // 24 horas
});

routes
	.route('/')
	.get((req, res) => res.json({ msg: 'Everything is running fine!' }));

routes
	.route('/users')
	.post(UserValidator.store, UserController.store)
	.put(AuthMiddleware, UserValidator.update, UserController.update);

routes
	.route('/session')
	.post(bruteForce.prevent, SessionValidation.store, SessionController.store);

export default routes;
