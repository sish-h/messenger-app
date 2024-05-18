import { IUser } from '@messaging-app/shared';
import {
	Avatar,
	Badge,
	Drawer,
	List,
	ListItemAvatar,
	styled,
} from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { ReactElement } from 'react';
import { useSetRecoilState } from 'recoil';
import { ConditionalWrapper } from '../../common/utils';
import queryKeys from '../../constants/reactQueryKeys';
import useGetFriendsIds from '../../hooks/useGetFriends';
import useGetOnlineUsers from '../../hooks/useGetOnlineUsers';
import useGetUsersById from '../../hooks/useGetUsersById';
import selectedFriendState from '../../recoil/selectedFriend/atom';

const OnlineBadge = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		backgroundColor: '#44b700',
		color: '#44b700',
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		'&::after': {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			borderRadius: '50%',
			animation: 'ripple 1.2s infinite ease-in-out',
			border: '1px solid currentColor',
			content: '""',
		},
	},
	'@keyframes ripple': {
		'0%': {
			transform: 'scale(.8)',
			opacity: 1,
		},
		'100%': {
			transform: 'scale(2.4)',
			opacity: 0,
		},
	},
}));

const wrapper = (children: ReactElement) => (
	<OnlineBadge
		overlap='circular'
		anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
		variant='dot'
	>
		{children}
	</OnlineBadge>
);

const FriendsListItem = ({
	friend,
	isOnline,
}: {
	friend: IUser;
	isOnline: boolean;
}) => {
	const setSelectedFriend = useSetRecoilState(selectedFriendState);
	const handleSelectFriend = () => setSelectedFriend(friend);

	return (
		<ListItem button onClick={handleSelectFriend}>
			<ListItemAvatar>
				<ConditionalWrapper condition={isOnline} wrapper={wrapper}>
					<Avatar src={friend.avatar} sx={{ width: '55px', height: '55px' }} />
				</ConditionalWrapper>
			</ListItemAvatar>
			<ListItemText
				sx={{ display: { xs: 'none', md: 'inherit' }, ml: '12px' }}
				primary={friend.userName}
			/>
		</ListItem>
	);
};

const FriendsList = () => {
	const { data: friendIds } = useGetFriendsIds();
	const { data: friends } = useGetUsersById(friendIds, queryKeys.friends);
	const { data: onlineUsers } = useGetOnlineUsers();

	return (
		<Drawer
			sx={{
				width: { xs: '103px', md: '360px' },
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: { xs: '103px', md: '360px' },
					boxSizing: 'border-box',
					mt: { xs: '56px', sm: '64px' },
				},

				zIndex: 0,
			}}
			variant='permanent'
			anchor='left'
		>
			<List
				sx={{
					width: '360px',
					mx: '8px',
					mt: '8px',
					'& .MuiButtonBase-root': {
						borderRadius: '8px',
						':hover': {
							borderRadius: '8px',
						},
					},
				}}
			>
				{friends?.map((friend) => (
					<FriendsListItem
						key={friend.id}
						isOnline={onlineUsers?.indexOf(friend.id) !== -1}
						friend={friend}
					/>
				))}
			</List>
		</Drawer>
	);
};

export default FriendsList;
