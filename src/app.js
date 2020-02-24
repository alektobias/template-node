import 'dotenv/config';

import express from 'express';
import RateLimit from 'express-rate-limit';

import BullBoard from 'bull-board';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import RateLimitRedis from 'rate-limit-redis';
import redis from 'redis';
import Youch from 'youch';

import Queue from './app/lib/Queue';
import redisConfig from './config/redis';
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
		this.server.use(morgan('dev'));
		this.server.use(helmet());
		this.server.use(cors({ origin: process.env.ORIGIN }));

		if (process.env.NODE_ENV !== 'development') {
			this.server.use(
				new RateLimit({
					store: new RateLimitRedis({
						client: redis.createClient(redisConfig),
					}),
					windowMs: 1000 * 60 * 15,
					max: 100,
				})
			);
		}

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
