import User from '../models/User';

class UserController {
	async store(req, res, next) {
		try {
			const { email } = req.body;
			const userExists = await User.findOne({ where: { email } });

			if (userExists)
				return res
					.status(400)
					.json({ error: 'This email is already registered!' });

			const user = await User.create(req.body);

			return res.json(user);
		} catch (error) {
			console.log(error);
			return next(new Error(error));
		}
	}

	async update(req, res, next) {
		try {
			const { email, oldPassword } = req.body;

			const user = await User.findByPk(req.userId);

			if (email && email !== user.email) {
				const userExists = await User.findOne({ where: { email } });

				if (userExists)
					return res
						.status(400)
						.json({ error: 'This email is already registred.' });
			}

			if (oldPassword && !(await user.checkPassword(oldPassword)))
				return res.status(401).json({ error: 'Password incorrect.' });

			const { id, name, email: userEmail } = await user.update(req.body);

			return res.json({ id, name, email: userEmail });
		} catch (error) {
			return next(new Error(error));
		}
	}
}

export default new UserController();
