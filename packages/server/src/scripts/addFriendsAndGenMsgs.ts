import faker from '@faker-js/faker';
import { IChatMsg } from '@messaging-app/shared';
import chalk from 'chalk';
import messagesModel from '../MESSAGES/messages.model';
import { TUserDoc } from './genUsers';

const addFriendsAndGenMsgs = async (
	users: TUserDoc[],
	messagesNumber: number
) => {
	console.log(chalk.yellow('Adding Friends...'));

	const randIdx = () => Math.round(Math.random() * (users.length - 1));

	const messages: Omit<IChatMsg, 'id'>[] = [];
	const promises: Promise<unknown>[] = [];
	const usersMap = new Map<string, TUserDoc>();

	users.forEach((user) => usersMap.set(user.id, user));
	usersMap.forEach((user, userId) => {
		//befriend 50% of users
		for (let index = 0; user.friends.length < users.length * 0.5; index++) {
			//friend the first two users
			let friendId = users[index ? 1 : randIdx()].id;
			while (friendId === userId || user.friends.indexOf(friendId) !== -1)
				friendId = users[randIdx()].id;

			const friend = usersMap.get(friendId);
			user.friends.push(friendId);
			friend?.friends.push(userId);

			for (let index = 0; index < messagesNumber; index++) {
				const isEven = index % 2 === 0;
				messages.push({
					targetId: isEven ? userId : friendId,
					senderId: isEven ? friendId : userId,
					text: faker.lorem.sentence(3),
					status: 'sent',
				});
			}
		}
		promises.push(user.save());
	});

	promises.push(messagesModel.create(messages));
	await Promise.all(promises);
};

export default addFriendsAndGenMsgs;
