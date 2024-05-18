import { Request } from 'express';
import WebSocket from 'ws';
import { IListener } from '../common/interfaces';
import { IWSChatTypingMsg, TWSMessage } from '@messaging-app/shared';
import { socketConnections } from './app';

const wss = new WebSocket.Server({ noServer: true });

const messageListener =
	(currentUserId: string): IListener =>
	(messageStr) => {
		const message: TWSMessage = JSON.parse(messageStr.toString());

		switch (message.type) {
			case 'chat-typing-started':
				{
					const conn = socketConnections.get(message.payload.userId);
					if (!conn) return;
					const newMsg: IWSChatTypingMsg = {
						type: message.type,
						payload: { userId: currentUserId },
					};
					conn.send(JSON.stringify(newMsg));
				}
				break;
			case 'chat-typing-stopped':
				{
					const conn = socketConnections.get(message.payload.userId);
					if (!conn) return;
					const newMsg: IWSChatTypingMsg = {
						type: message.type,
						payload: { userId: currentUserId },
					};
					conn.send(JSON.stringify(newMsg));
				}
				break;
			default:
				console.log(message);
				break;
		}
	};

wss.on('connection', (ws, request) => {
	const req = request as Request;
	const userId = req.currentUserId as string;

	socketConnections.set(userId, ws);

	ws.on('message', messageListener(userId));

	ws.on('close', () => {
		socketConnections.delete(userId);
	});
});

export default wss;
