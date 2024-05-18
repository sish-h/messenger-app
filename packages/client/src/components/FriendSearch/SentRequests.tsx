import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import queryKeys from '../../constants/reactQueryKeys';
import { useGetSentFriendRequests } from '../../hooks/useFriendRequest';
import useGetUsersById from '../../hooks/useGetUsersById';
import UserCard from './UserCard';

const SentRequests = () => {
	const { data: sentFriendRequests } = useGetSentFriendRequests();

	const { data: friendRequestReceivers } = useGetUsersById(
		sentFriendRequests?.map((request) => request.recipient),
		queryKeys.friendRequestReceivers
	);

	if (!sentFriendRequests || !sentFriendRequests.length) return null;

	return (
		<>
			<Typography variant='h6' sx={{ mx: '18px', mt: '18px' }}>
				Sent Friend Requests
			</Typography>{' '}
			<Grid
				container
				direction='row'
				spacing={1}
				sx={{ p: '18px' }}
				justifyContent='flex-start'
			>
				{friendRequestReceivers?.map((friendRequestReceivers) => (
					<Grid item key={friendRequestReceivers.id}>
						<UserCard cardType='sent-request' user={friendRequestReceivers} />
					</Grid>
				))}
			</Grid>
		</>
	);
};

export default SentRequests;
