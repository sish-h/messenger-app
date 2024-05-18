import { IWSChatMsg, IWSChatTypingMsg } from './interfaces';

export type TChatMsgStatus = 'pending' | 'sent' | 'received' | 'viewed';
export type TFriendRequestStatus = 'pending' | 'accepted' | 'rejected';
export type TWSMessage = IWSChatTypingMsg | IWSChatMsg;
