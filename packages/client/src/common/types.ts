import { IChatMsg, IUser } from '@messaging-app/shared';
import { InferType } from 'yup';
import { loginValidationSchema, signUpValidationSchema } from './validation';

export type TCurrentUser = Omit<IUser, 'friends'> & { csrfToken: string };
export type TLoginInput = InferType<typeof loginValidationSchema>;
export type TSignUpInput = InferType<typeof signUpValidationSchema>;
export type TSendMessageInput = Omit<IChatMsg, 'id' | 'status'>;
