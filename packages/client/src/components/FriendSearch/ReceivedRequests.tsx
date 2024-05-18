import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import queryKeys from '../../constants/reactQueryKeys';
import { useGetReceivedFriendRequests } from '../../hooks/useFriendRequest';
import useGetUsersById from '../../hooks/useGetUsersById';
import UserCard from './UserCard';

const ReceivedRequests = () => {
	const { data: receivedFriendRequests } = useGetReceivedFriendRequests();
	const { data: friendRequesters } = useGetUsersById(
		receivedFriendRequests?.map((request) => request.requester),
		queryKeys.friendRequesters
	);
	const requestsMap = new Map<string, string>();
	receivedFriendRequests?.forEach((friendRequest) => {
		requestsMap.set(friendRequest.requester, friendRequest.id);
	});

	if (!receivedFriendRequests || !receivedFriendRequests.length) return null;

	return (
		<>
			<Typography variant='h6' sx={{ mx: '18px', mt: '18px' }}>
				Friend Requests
			</Typography>
			<Grid
				container
				direction='row'
				spacing={1}
				sx={{ p: '18px' }}
				justifyContent='flex-start'
			>
				{friendRequesters?.map((friendRequester) => (
					<Grid item key={friendRequester.id}>
						<UserCard
							cardType='received-request'
							user={friendRequester}
							requestId={requestsMap.get(friendRequester.id) ?? ''}
						/>
					</Grid>
				))}
			</Grid>
		</>
	);
};

export default ReceivedRequests;
