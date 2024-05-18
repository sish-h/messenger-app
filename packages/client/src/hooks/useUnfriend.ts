import { IUser } from '@messaging-app/shared';
import { useMutation, useQueryClient } from 'react-query';
import queryKeys from '../constants/reactQueryKeys';
import { axiosInstance } from '../services/axios';

const unfriend = async (userId: string | undefined): Promise<unknown> => {
	if (!userId) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.delete(`/users/friend/${userId}`, {
		withCredentials: true,
	});
	return data;
};

const useUnfriend = () => {
	const queryClient = useQueryClient();
	return useMutation(unfriend, {
		onMutate: async (userId) => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(['users', 'friends']);
			await queryClient.cancelQueries(queryKeys.friendsIds);

			// Snapshot the previous value
			const prevFriends = queryClient.getQueryData<IUser[]>(queryKeys.friends);
			const prevFriendsIds = queryClient.getQueryData<string[]>(
				queryKeys.friendsIds
			);

			// Optimistically update to the new value
			queryClient.setQueryData<IUser[] | undefined>(queryKeys.friends, (old) =>
				old?.filter((friend) => friend.id !== userId)
			);

			queryClient.setQueryData<string[] | undefined>(
				queryKeys.friendsIds,
				(old) => old?.filter((friendId) => friendId !== userId)
			);

			// Return a context object with the snapshot value
			return { prevFriends, prevFriendsIds };
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData<IUser[] | undefined>(
				queryKeys.friends,
				context?.prevFriends
			);
			queryClient.setQueryData<string[] | undefined>(
				queryKeys.friendsIds,
				context?.prevFriendsIds
			);
		},
	});
};

export default useUnfriend;
