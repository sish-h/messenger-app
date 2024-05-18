import { IChatMsg } from '@messaging-app/shared';

export type TMessageInput = Pick<IChatMsg, 'targetId' | 'text' | 'senderId'>;
