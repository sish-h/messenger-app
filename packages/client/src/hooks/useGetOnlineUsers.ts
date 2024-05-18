import { useQuery } from 'react-query';
import queryKeys from '../constants/reactQueryKeys';
import { axiosInstance } from '../services/axios';

const getOnlineUsers = async (): Promise<string[]> => {
	const { data } = await axiosInstance.get(`/users/online`, {
		withCredentials: true,
	});
	return data;
};

const useGetOnlineUsers = () =>
	useQuery(queryKeys.activeFriends, () => getOnlineUsers());

export default useGetOnlineUsers;
