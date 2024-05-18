import { IUser } from '@messaging-app/shared';

export type TLoginInput = Pick<IUser, 'email' | 'password'>;
export type TSignUpInput = Omit<IUser, 'id'>;
export type TUpdateUserInput = IUser;
export type TGetUsersInput = string[];
