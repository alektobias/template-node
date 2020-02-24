import bcrypt from 'bcryptjs';
import Sequelize, { Model } from 'sequelize';
import { uuid } from 'uuidv4';

class User extends Model {
	static init(sequelize) {
		super.init(
			{
				name: Sequelize.STRING,
				email: Sequelize.STRING,
				password: Sequelize.VIRTUAL,
				password_hash: Sequelize.STRING,
			},
			{ sequelize }
		);

		this.addHook('beforeCreate', user => {
			user.id = uuid();
		});

		this.addHook('beforeSave', async user => {
			if (user.password) {
				user.password_hash = await bcrypt.hash(user.password, 8);
			}
		});

		return this;
	}

	checkPassword(password) {
		return bcrypt.compare(password, this.password_hash);
	}
}
export default User;
