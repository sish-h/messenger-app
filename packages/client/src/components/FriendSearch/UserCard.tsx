import { IUser } from '@messaging-app/shared';
import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Stack,
	Tooltip,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useQueryClient } from 'react-query';
import queryKeys from '../../constants/reactQueryKeys';
import {
	useAcceptFriendRequest,
	useRejectFriendRequest,
	useSendFriendRequest,
} from '../../hooks/useFriendRequest';

interface IReceivedRequestCardProps {
	cardType: 'received-request';
	user: IUser;
	requestId: string;
}

interface ISentRequestCardProps {
	cardType: 'sent-request';
	user: IUser;
}

interface ISendRequestProps {
	cardType: 'send-request';
	user: IUser;
}

type TUserCardProps =
	| IReceivedRequestCardProps
	| ISentRequestCardProps
	| ISendRequestProps;

const UserCard = (props: TUserCardProps) => {
	const { user } = props;

	const { mutate: sendFriendRequest } = useSendFriendRequest();
	const { mutate: rejectFriendRequest } = useRejectFriendRequest();
	const { mutate: acceptFriendRequest } = useAcceptFriendRequest(props.user);
	const queryClient = useQueryClient();
	const isFriend =
		queryClient
			.getQueryData<string[]>(queryKeys.friendsIds)
			?.indexOf(user.id) !== -1;

	return (
		<Card sx={{ width: 200 }}>
			<CardMedia
				crossOrigin='anonymous'
				loading='lazy'
				component='img'
				height='194'
				image={user.avatar}
				alt='user picture'
			/>
			<CardContent>
				<Tooltip
					title={user.userName}
					disableHoverListener={user.userName.length < 10}
				>
					<Typography gutterBottom variant='h5' component='div' noWrap>
						{user.userName}
					</Typography>
				</Tooltip>
			</CardContent>
			<CardActions sx={{ flexDirection: 'column' }}>
				{(() => {
					switch (props.cardType) {
						case 'send-request':
							return (
								<Button
									disabled={isFriend}
									variant='outlined'
									fullWidth
									onClick={() => sendFriendRequest(user.id)}
								>
									{isFriend ? 'friend' : 'add friend'}
								</Button>
							);
						case 'sent-request':
							return (
								<Button disabled={true} variant='outlined' fullWidth>
									request sent
								</Button>
							);
						case 'received-request':
							return (
								<Stack sx={{ width: '100%' }} spacing={1}>
									<Button
										disabled={false}
										variant='contained'
										fullWidth
										onClick={() => acceptFriendRequest(props.requestId)}
									>
										Accept Request
									</Button>
									<Button
										disabled={false}
										variant='contained'
										color='error'
										fullWidth
										onClick={() => rejectFriendRequest(props.requestId)}
									>
										Reject Request
									</Button>
								</Stack>
							);
						default:
							return <h1>Error</h1>;
					}
				})()}
			</CardActions>
		</Card>
	);
};

export default UserCard;
