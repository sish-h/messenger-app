import Joi from 'joi';
import { TLoginInput, TSignUpInput, TUpdateUserInput } from './users.types';
export const signupValidationSchema = Joi.object<TSignUpInput>({
	avatar: Joi.string().uri(),
	userName: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
});

export const updateUserValidationSchema = Joi.object<TUpdateUserInput>({
	avatar: Joi.string().uri(),
	userName: Joi.string(),
	email: Joi.string().email(),
	password: Joi.string().min(8),
});

export const loginValidationSchema = Joi.object<TLoginInput>({
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
});
