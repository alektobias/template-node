import { Router } from 'express';

const routes = new Router();

routes
	.route('/')
	.get((req, res) => res.json({ msg: 'Everything is running fine!' }));

export default routes;
