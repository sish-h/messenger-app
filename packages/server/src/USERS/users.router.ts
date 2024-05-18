import { Router } from 'express';
import {
	authenticate,
	csrfLogin,
	csrfProtection,
	validateInput,
} from '../common/middleware';
import { documentIdsValidationSchema } from '../common/validation';
import {
	deleteUser,
	getAccounts,
	getFriends,
	getOnlineUser,
	getUserById,
	getUsersByIds,
	login,
	logout,
	removeFriend,
	searchUsersByUserName,
	signup,
	updateUser,
} from './users.controllers';
import {
	loginValidationSchema,
	signupValidationSchema,
	updateUserValidationSchema,
} from './users.validation';

const usersRouter = Router();

usersRouter.get('/accounts', getAccounts);

usersRouter.get('/online', authenticate, getOnlineUser);

usersRouter.post(
	'/get-by-ids',
	validateInput(documentIdsValidationSchema, 'userIds'),
	getUsersByIds
);

usersRouter.post(
	'/signup',
	validateInput(signupValidationSchema, 'signupInput'),
	signup
);

usersRouter.post(
	'/login',
	validateInput(loginValidationSchema, 'loginInput'),
	csrfLogin,
	login
);

usersRouter.delete('/logout', authenticate, logout);
usersRouter.use(csrfProtection);
usersRouter.put(
	'/update',
	authenticate,
	validateInput(updateUserValidationSchema, 'updateUserInput'),
	updateUser
);
usersRouter.delete('/delete', authenticate, deleteUser);

usersRouter.get('/friends', authenticate, getFriends);
usersRouter.delete('/friend/:friendId', authenticate, removeFriend);
usersRouter.get('/search/:username', authenticate, searchUsersByUserName);

usersRouter.get('/:userId', getUserById);

export default usersRouter;
