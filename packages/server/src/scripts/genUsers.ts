import { faker } from '@faker-js/faker';
import chalk from 'chalk';
import { Document, Types } from 'mongoose';
import { IUser } from '@messaging-app/shared';
import UsersModel from '../USERS/users.model';
import { TSignUpInput } from 'src/USERS/users.types';
export type TUserDoc = Document<unknown, unknown, IUser> &
	IUser & {
		_id: Types.ObjectId;
	};

const getMail = (idx: number) => {
	if (idx === 0) return 'test1@gmail.com';
	else if (idx === 1) return 'test2@gmail.com';
	return faker.internet.email();
};

export const genUser = async (usersNumber: number) => {
	console.log(chalk.yellow('Creating Users...'));
	const users: TSignUpInput[] = [];
	for (let idx = 0; idx < usersNumber; idx++) {
		users.push({
			email: getMail(idx),
			password: 'password',
			userName: faker.internet.userName(),
			avatar: faker.internet.avatar(),
			friends: [],
		});
	}

	return await UsersModel.create(users);
};
