import { IFriendRequest } from '@messaging-app/shared';

export type TFriendRequestInput = Omit<IFriendRequest, 'id'>;
