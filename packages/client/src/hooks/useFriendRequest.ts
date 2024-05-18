import { IFriendRequest, IUser } from '@messaging-app/shared';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useRecoilValue } from 'recoil';
import queryKeys from '../constants/reactQueryKeys';
import userSearchTermState from '../recoil/userSearchTerm/atom';
import { axiosInstance } from '../services/axios';

const sendFriendRequest = async (
	userId: string | undefined
): Promise<string> => {
	if (!userId) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.post(
		`/friend-requests/send/${userId}`,
		{},
		{ withCredentials: true }
	);
	return data;
};

const acceptFriendRequest = async (
	requestId: string | undefined
): Promise<string> => {
	if (!requestId) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.put(
		`/friend-requests/accept/${requestId}`,
		{},
		{ withCredentials: true }
	);
	return data;
};

const rejectFriendRequest = async (
	requestId: string | undefined
): Promise<string> => {
	if (!requestId) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.put(
		`/friend-requests/reject/${requestId}`,
		{},
		{ withCredentials: true }
	);
	return data;
};

const getSentFriendRequests = async (): Promise<IFriendRequest[]> => {
	const { data } = await axiosInstance.get(`/friend-requests/sent`, {
		withCredentials: true,
	});
	return data;
};

export const getReceivedFriendRequests = async (): Promise<
	IFriendRequest[]
> => {
	const { data } = await axiosInstance.get(`/friend-requests/received`, {
		withCredentials: true,
	});
	return data;
};

export const useAcceptFriendRequest = (friendRequester: IUser) => {
	const queryClient = useQueryClient();
	return useMutation(acceptFriendRequest, {
		// When mutate is called:
		onMutate: async (requestId) => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(['users', 'friends']);
			await queryClient.cancelQueries(queryKeys.friendsIds);
			await queryClient.cancelQueries(queryKeys.friendRequesters);
			await queryClient.cancelQueries(queryKeys.receivedFriendRequests);

			// Snapshot the previous value
			const prevFriends = queryClient.getQueryData<IUser[]>(queryKeys.friends);
			const prevFriendRequesters = queryClient.getQueryData<IUser[]>(
				queryKeys.friendRequesters
			);

			// Optimistically update to the new value
			queryClient.setQueryData<IUser[] | undefined>(queryKeys.friends, (old) =>
				old ? [friendRequester, ...old] : undefined
			);
			queryClient.setQueryData<IFriendRequest[] | undefined>(
				queryKeys.receivedFriendRequests,
				(old) => old?.filter((request) => request.id !== requestId)
			);
			queryClient.setQueryData<IUser[] | undefined>(
				queryKeys.friendRequesters,
				(old) => old?.filter((user) => user.id !== friendRequester.id)
			);

			// Return a context object with the snapshot value
			return { prevFriends, prevFriendRequesters };
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData<IUser[] | undefined>(
				queryKeys.friends,
				context?.prevFriends
			);
			queryClient.setQueryData<IUser[] | undefined>(
				queryKeys.receivedFriendRequests,
				context?.prevFriendRequesters
			);
		},

		// Always refetch after error or success:
		onSettled: () => {
			queryClient.invalidateQueries(queryKeys.activeFriends);
		},
	});
};

export const useGetReceivedFriendRequests = () =>
	useQuery(queryKeys.receivedFriendRequests, getReceivedFriendRequests);

export const useGetSentFriendRequests = () =>
	useQuery(queryKeys.sentFriendRequests, getSentFriendRequests);

export const useSendFriendRequest = () => {
	const queryClient = useQueryClient();
	const userSearchTerm = useRecoilValue(userSearchTermState);
	const userSearchResultsQueryKey = ['users', 'search', userSearchTerm];

	return useMutation(sendFriendRequest, {
		// When mutate is called:
		onMutate: async (userId) => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(['friend-requests']);
			await queryClient.cancelQueries(['users']);

			// Snapshot the previous value
			const prevUserSearchResults = queryClient.getQueryData<IUser[]>(
				userSearchResultsQueryKey
			);

			// Optimistically update to the new value
			queryClient.setQueryData<IUser[] | undefined>(
				userSearchResultsQueryKey,
				(old) => old?.filter((user) => user.id !== userId)
			);

			// Return a context object with the snapshot value
			return { prevUserSearchResults };
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData<IUser[] | undefined>(
				userSearchResultsQueryKey,
				context?.prevUserSearchResults
			);
		},

		onSettled: () => {
			queryClient.invalidateQueries(queryKeys.sentFriendRequests);
		},
	});
};

export const useRejectFriendRequest = () => {
	const queryClient = useQueryClient();
	return useMutation(rejectFriendRequest, {
		// When mutate is called:
		onMutate: async (requestId) => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(queryKeys.receivedFriendRequests);
			await queryClient.cancelQueries(queryKeys.friendRequestReceivers);

			// Snapshot the previous value
			const prevReceivedFriendRequests = queryClient.getQueryData<
				IFriendRequest[]
			>(queryKeys.receivedFriendRequests);

			const prevFriendRequestReceivers = queryClient.getQueryData<IUser[]>(
				queryKeys.friendRequestReceivers
			);

			// Optimistically update to the new value
			queryClient.setQueryData<IFriendRequest[] | undefined>(
				queryKeys.receivedFriendRequests,
				(old) =>
					old?.filter((request) => {
						if (request?.id === requestId)
							queryClient.setQueryData<IUser[] | undefined>(
								queryKeys.friendRequestReceivers,
								(old) => old?.filter((user) => user.id !== request.requester)
							);
						return request.id !== requestId;
					})
			);

			// Return a context object with the snapshot value
			return { prevReceivedFriendRequests, prevFriendRequestReceivers };
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData<IFriendRequest[] | undefined>(
				queryKeys.receivedFriendRequests,
				context?.prevReceivedFriendRequests
			);
			queryClient.setQueryData<IUser[] | undefined>(
				queryKeys.friendRequestReceivers,
				context?.prevFriendRequestReceivers
			);
		},
	});
};
