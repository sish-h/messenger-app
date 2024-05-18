import { IChatMsg } from '@messaging-app/shared';
import { useMutation, useQueryClient } from 'react-query';
import { TSendMessageInput } from '../common/types';
import queryKeys from '../constants/reactQueryKeys';
import { axiosInstance } from '../services/axios';

const sendMessage = async (
	sendMessageInput: TSendMessageInput
): Promise<unknown> => {
	const { data } = await axiosInstance.post(`/messages`, sendMessageInput, {
		withCredentials: true,
	});
	return data;
};

const useSendMessage = () => {
	const queryClient = useQueryClient();

	return useMutation(sendMessage, {
		// When mutate is called:

		onMutate: async (newMessage) => {
			const queryKey = [queryKeys.conversation, newMessage.targetId];
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)

			await queryClient.cancelQueries(queryKey);

			// Snapshot the previous value

			const previousConversation =
				queryClient.getQueryData<IChatMsg[]>(queryKey);

			// Optimistically update to the new value

			queryClient.setQueryData<IChatMsg[] | undefined>(queryKey, (old) =>
				old?.concat({
					id: Math.random().toString(),
					...newMessage,
					status: 'pending',
				})
			);

			// Return a context object with the snapshot value

			return { previousConversation };
		},

		// If the mutation fails, use the context returned from onMutate to roll back

		onError: (err, newMessage, context) => {
			queryClient.setQueryData(
				[queryKeys.conversation, newMessage.targetId],
				context?.previousConversation
			);
		},

		// Always refetch after error or success:

		onSettled: (data, err, newMessage) => {
			queryClient.invalidateQueries([
				queryKeys.conversation,
				newMessage.targetId,
			]);
		},
	});
};

export default useSendMessage;
