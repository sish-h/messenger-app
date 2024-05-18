import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import useSearchUsersByUserName from '../../hooks/useSearchUsersByUserName';
import UserCard from './UserCard';

const SearchResults = ({ searchTerm }: { searchTerm: string }) => {
	const { data: users } = useSearchUsersByUserName(searchTerm);

	if (!users) return null;

	return (
		<>
			{users.length >= 0 && (
				<Typography variant='h6' sx={{ mx: '18px', mt: '18px' }}>
					Search Results
				</Typography>
			)}
			{users.length > 0 ? (
				<Grid
					container
					direction='row'
					spacing={1}
					sx={{ p: '18px' }}
					justifyContent='flex-start'
				>
					{users.map((suggestedFriend) => (
						<Grid item key={suggestedFriend.id}>
							<UserCard cardType='send-request' user={suggestedFriend} />
						</Grid>
					))}
				</Grid>
			) : (
				<Typography
					color='red'
					align='center'
					variant='h6'
					sx={{ mx: '18px', mt: '18px' }}
				>
					No Users Found
				</Typography>
			)}
		</>
	);
};

export default SearchResults;
