import 'express-serve-static-core';
import { DOCUMENT_IDS } from '../common/strings';
import { MESSAGE_INPUT } from '../MESSAGES/messages.strings';
import { TMessageInput } from '../MESSAGES/messages.types';
import {
	LOGIN_INPUT,
	SIGNUP_INPUT,
	UPDATE_USER_INPUT,
	USER_IDS,
} from '../USERS/users.strings';
import {
	TGetUsersInput,
	TLoginInput,
	TSignUpInput,
	TUpdateUserInput,
} from '../USERS/users.types';

declare module 'express-serve-static-core' {
	interface Request {
		currentUserId?: string;
		[LOGIN_INPUT]?: TLoginInput;
		[SIGNUP_INPUT]?: TSignUpInput;
		[UPDATE_USER_INPUT]?: TUpdateUserInput;
		[USER_IDS]?: TGetUsersInput;
		[MESSAGE_INPUT]?: TMessageInput;
		[DOCUMENT_IDS]?: string[];
	}
}
