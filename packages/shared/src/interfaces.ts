import { TChatMsgStatus, TFriendRequestStatus } from './types';

export interface IUser {
	id: string;
	avatar?: string;
	userName: string;
	email: string;
	password: string;
	friends: string[];
}

export interface IFriendRequest {
	id: string;
	requester: string;
	recipient: string;
	status: TFriendRequestStatus;
}

export interface IChatMsg {
	id: string;
	senderId: string;
	targetId: string;
	text: string;
	status: TChatMsgStatus;
}

export interface IWSChatTypingMsg {
	type: 'chat-typing-started' | 'chat-typing-stopped';
	payload: { userId: string };
}

export interface IWSChatMsg {
	type: 'chat-message';
	payload: IChatMsg;
}
