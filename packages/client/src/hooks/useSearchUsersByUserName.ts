import { useQuery } from 'react-query';
import { IUser } from '@messaging-app/shared';
import queryKeys from '../constants/reactQueryKeys';
import { axiosInstance } from '../services/axios';

const searchUsersByUserName = async (
	userName: string | undefined
): Promise<IUser[]> => {
	if (!userName) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.get(`/users/search/${userName}`, {
		withCredentials: true,
	});
	return data;
};

const useSearchUsersByUserName = (userName: string | undefined) =>
	useQuery(
		[...queryKeys.searchUsers, userName],
		() => searchUsersByUserName(userName),
		{ enabled: Boolean(userName && userName.length > 2) }
	);

export default useSearchUsersByUserName;
