import { IChatMsg, TWSMessage } from '@messaging-app/shared';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { WS_ORIGIN } from '../constants/envVars';
import queryKeys from '../constants/reactQueryKeys';
import currentUserState from '../recoil/currentUser/atom';
import typingState from '../recoil/typing/atom';
import webSocketState from '../recoil/webSocket/atom';

export const useSocketConnect = () => {
	const [socket, setSocket] = useRecoilState(webSocketState);
	const setTypingMap = useSetRecoilState(typingState);
	const currentUser = useRecoilValue(currentUserState);

	const openSocketEffectCallback = () => {
		if (!currentUser || socket) return;
		setSocket(new WebSocket(WS_ORIGIN));
	};

	const onOpenEffectCallback = () => {
		if (!socket) return;
		socket.onopen = () => console.log('WebSocket Connected');
	};

	const onCloseEffectCallback = () => {
		if (!socket) return;
		socket.onclose = () => {
			console.log('WebSocket Closed');
			setTimeout(() => setSocket(new WebSocket(WS_ORIGIN)), 5000);
		};
	};

	const queryClient = useQueryClient();
	const onMessageEffectCallback = () => {
		if (!socket) return;
		socket.onmessage = (e) => {
			const message: TWSMessage = JSON.parse(e.data);
			switch (message.type) {
				case 'chat-message':
					setTypingMap((prev) =>
						new Map(prev).set(message.payload.senderId, false)
					);
					setTimeout(async () => {
						await queryClient.cancelQueries(queryKeys.conversation);
						queryClient.setQueryData<IChatMsg[]>(
							[queryKeys.conversation, message.payload.senderId],
							(old) => (old ? old.concat(message.payload) : [message.payload])
						);
					}, 200);
					break;

				case 'chat-typing-started':
					setTypingMap((prev) =>
						new Map(prev).set(message.payload.userId, true)
					);
					break;

				case 'chat-typing-stopped':
					setTypingMap((prev) =>
						new Map(prev).set(message.payload.userId, false)
					);
					break;

				default:
					console.log(message);
					break;
			}
		};
	};

	useEffect(openSocketEffectCallback, [currentUser, setSocket, socket]);
	useEffect(onOpenEffectCallback, [socket]);
	useEffect(onCloseEffectCallback, [setSocket, socket]);
	useEffect(onMessageEffectCallback, [queryClient, setTypingMap, socket]);
};
