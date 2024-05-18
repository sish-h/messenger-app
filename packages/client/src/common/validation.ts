import { object, ref, string } from 'yup';

export const signUpValidationSchema = object({
	userName: string().required('Username is a required field'),
	email: string().email().required('Email is a required field'),
	confirmEmail: string()
		.email()
		.required('Email is a required field')
		.oneOf([ref('email'), null], 'Emails do es not match'),
	password: string().required(),
	confirmPassword: string()
		.required('Password is a required field')
		.oneOf([ref('password'), null], 'Passwords do not match'),
}).required();

export const loginValidationSchema = object({
	email: string().required('Email is a required field'),
	password: string().required(),
}).required();

export const chatMsgSchema = object({
	text: string().required('cant sent empty chat message'),
}).required();

export const searchUserInputSchema = object({
	text: string().min(3).required('cant sent empty chat message'),
}).required();
