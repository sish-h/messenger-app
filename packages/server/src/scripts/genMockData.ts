import { clearDB, connectDB } from '../config/db';
import addFriendsAndGenMsgs from './addFriendsAndGenMsgs';
import { genUser } from './genUsers';

const main = async () => {
	await connectDB();
	await clearDB();
	const users = await genUser(30);
	await addFriendsAndGenMsgs(users, 25);
	process.exit(0);
};

main();
