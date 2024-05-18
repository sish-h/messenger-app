import { IChatMsg } from '@messaging-app/shared';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import queryKeys from '../constants/reactQueryKeys';
import currentUserState from '../recoil/currentUser/atom';
import { axiosInstance } from '../services/axios';

const getConversation = async (
	conversationMembers: string[]
): Promise<IChatMsg[]> => {
	if (conversationMembers.length <= 0)
		Promise.reject(new Error('Invalid body'));

	const { data } = await axiosInstance.post(
		`/messages/conversation`,
		conversationMembers,
		{ withCredentials: true }
	);
	return data;
};

const useGetConversation = (friendId: string | undefined) => {
	const currentUserId = useRecoilValue(currentUserState)?.id;
	const conversationMembers =
		friendId && currentUserId ? [friendId, currentUserId] : [];

	return useQuery(
		[queryKeys.conversation, friendId],
		() => getConversation(conversationMembers),
		{ enabled: Boolean(friendId && currentUserId) }
	);
};

export default useGetConversation;
