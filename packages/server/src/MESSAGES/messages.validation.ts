import Joi from 'joi';
import { TMessageInput } from './messages.types';

export const createMessageValidationSchema = Joi.object<TMessageInput>({
	targetId: Joi.string().required(),
	senderId: Joi.string().required(),
	text: Joi.string().required(),
});
