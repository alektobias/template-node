import 'dotenv/config';

import BullBoard from 'bull-board';
import express from 'express';
import Youch from 'youch';

import Queue from './app/lib/Queue';
import routes from './routes';

import 'express-async-errors';

import './database';

class App {
	constructor() {
		this.server = express();

		this.middlewares();
		this.routes();
		this.exceptionHandler();
	}

	middlewares() {
		this.server.use(express.json());

		BullBoard.setQueues(Queue.queues.map(queue => queue.bull));
		this.server.use('/queue', BullBoard.UI);
	}

	routes() {
		this.server.use(routes);
	}

	exceptionHandler() {
		this.server.use(async (err, req, res, next) => {
			if (process.env.NODE_ENV === 'development') {
				const errors = await new Youch(err, req).toJSON();

				return res.status(500).json(errors);
			}

			return res.status(500).json({ error: 'Internal server error' });
		});
	}
}
export default new App().server;
