import { debounce } from 'lodash';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useRecoilValue } from 'recoil';
import webSocketState from '../recoil/webSocket/atom';

export const useTypingNotification = (friendId: string | undefined) => {
	const socket = useRecoilValue(webSocketState);
	const queryClient = useQueryClient();
	const activeUsers = queryClient.getQueryData<string[]>('active-users');

	const debounceStartTyping = debounce(
		(message) => socket?.send(JSON.stringify(message)),
		1000,
		{ leading: true, trailing: false }
	);

	const debounceEndTyping = debounce(
		(message) => socket?.send(JSON.stringify(message)),
		1000,
		{ leading: false, trailing: true }
	);

	const handleInputKeyDown = () => {
		if (!friendId || activeUsers?.indexOf(friendId) === -1) return;

		const message = {
			type: 'chat-typing-started',
			payload: { userId: friendId },
		};
		debounceStartTyping(message);
	};

	const handleInputKeyUp = () => {
		if (!friendId || activeUsers?.indexOf(friendId) === -1) return;

		const message = {
			type: 'chat-typing-stopped',
			payload: { userId: friendId },
		};
		debounceEndTyping(message);
	};

	useEffect(
		() => () => {
			debounceStartTyping.cancel();
			debounceEndTyping.cancel();
		},
		[debounceEndTyping, debounceStartTyping]
	);

	return { handleInputKeyDown, handleInputKeyUp };
};
