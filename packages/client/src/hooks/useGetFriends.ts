import { useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import queryKeys from '../constants/reactQueryKeys';
import typingState from '../recoil/typing/atom';
import { axiosInstance } from '../services/axios';

const getFriendsIds = async (): Promise<string[]> => {
	const { data } = await axiosInstance.get(`/users/friends`, {
		withCredentials: true,
	});
	return data;
};

const useGetFriendsIds = () => {
	const setTypingMap = useSetRecoilState(typingState);
	return useQuery(queryKeys.friendsIds, getFriendsIds, {
		onSuccess(data) {
			const newTypingMap = new Map<string, boolean>();
			data.forEach((friendId) => newTypingMap.set(friendId, false));
			setTypingMap(newTypingMap);
		},
	});
};

export default useGetFriendsIds;
