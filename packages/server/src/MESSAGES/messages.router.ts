import { Router } from 'express';
import { documentIdsValidationSchema } from '../common/validation';
import { authenticate, validateInput } from '../common/middleware';
import {
	createMessage,
	getMessagesByConversationMembers,
} from './messages.controllers';
import { createMessageValidationSchema } from './messages.validation';

const messagesRouter = Router();

messagesRouter.post(
	'/',
	authenticate,
	validateInput(createMessageValidationSchema, 'messageInput'),
	createMessage
);

messagesRouter.post(
	'/conversation',
	authenticate,
	validateInput(documentIdsValidationSchema, 'userIds'),
	getMessagesByConversationMembers
);

export default messagesRouter;
