import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
	async store(req, res, next) {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ where: { email } });

			if (!user) return res.status(400).json({ error: 'User not found!' });

			if (!(await user.checkPassword(password))) {
				return res.status(401).json({ error: 'Password does not match!' });
			}
			const { id, name } = user;
			return res.json({
				user: {
					id,
					email,
					name,
				},
				token: jwt.sign({ id }, authConfig.secret, {
					expiresIn: authConfig.expireIn,
				}),
			});
		} catch (error) {
			return next(new Error(error));
		}
	}
}

export default new SessionController();
