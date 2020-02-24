import Queue from 'bull';

import redisConfig from '../../config/redis';
import * as Jobs from '../jobs';

const queues = Object.values(Jobs).map(job => ({
	bull: new Queue(job.key, redisConfig),
	name: job.key,
	handle: job.handle,
}));

export default {
	queues,
	add(name, config) {
		const queue = this.queues.find(job => job.name === name);
		return queue.bull.add({}, config && { repeat: { cron: config } });
	},
	process() {
		return this.queues.forEach(queue => {
			queue.bull.process(queue.handle);

			queue.bull.on('failed', (job, err) => {
				console.log('Crawler Failed: ', job.key);
				console.log(err);
			});
		});
	},
};
