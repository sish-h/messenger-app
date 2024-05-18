import { useQuery } from 'react-query';
import { IUser } from '@messaging-app/shared';
import { axiosInstance } from '../services/axios';

const getUsersByIds = async (
	userIds: string[] | undefined
): Promise<IUser[]> => {
	if (!userIds) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.post(`/users/get-by-ids`, userIds, {
		withCredentials: true,
	});
	return data;
};

const useGetUsersById = (userIds: string[] = [], queryKey: string | string[]) =>
	useQuery(queryKey, () => getUsersByIds(userIds), {
		enabled: Boolean(userIds.length > 0),
	});

export default useGetUsersById;
