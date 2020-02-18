import * as Yup from 'yup';

class UserValidator {
	async store(req, res, next) {
		try {
			const schema = Yup.object().shape({
				name: Yup.string().required(),
				email: Yup.string()
					.email()
					.required(),
				password: Yup.string()
					.required()
					.min(6),
			});

			await schema.validate(req.body, { abortEarly: false });

			return next();
		} catch (error) {
			return res
				.status(400)
				.json({ error: 'Validation fails', messages: error.inner });
		}
	}

	async update(req, res, next) {
		try {
			const schema = Yup.object().shape({
				name: Yup.string(),
				email: Yup.string().email(),
				oldPassword: Yup.string().min(6),
				password: Yup.string()
					.min(6)
					.when('oldPassword', (oldPassword, field) =>
						oldPassword ? field.required() : field
					),
				confirmPassword: Yup.string()
					.min(6)
					.when('password', (password, field) =>
						password ? field.required().oneOf([Yup.ref('password')]) : field
					),
			});

			await schema.validate(req.body, { abortEarly: false });

			return next();
		} catch (error) {
			return res
				.status(400)
				.json({ error: 'Validation fails', messages: error.inner });
		}
	}
}

export default new UserValidator();
