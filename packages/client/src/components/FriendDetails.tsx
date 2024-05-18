import {
	ChevronRight as ChevronRightIcon,
	PersonRemove as PersonRemoveIcon,
} from '@mui/icons-material';
import {
	Avatar,
	Drawer,
	IconButton,
	Stack,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { useRecoilState } from 'recoil';
import useUnfriend from '../hooks/useUnfriend';
import friendDetailsOpenState from '../recoil/friendDetailsOpen/atom';
import selectedFriendState from '../recoil/selectedFriend/atom';

const FriendDetails = () => {
	const [selectedFriend, setSelectedFriend] =
		useRecoilState(selectedFriendState);
	const [open, setOpen] = useRecoilState(friendDetailsOpenState);
	const { mutate: unfriend } = useUnfriend();

	const handleUnfriend = () => {
		unfriend(selectedFriend?.id);
		setSelectedFriend(null);
	};

	const theme = useTheme();
	const isDownMd = useMediaQuery(theme.breakpoints.down('md'));

	if (!selectedFriend || !open) return null;

	return (
		<Drawer
			sx={{
				width: { xs: '100vw', md: '360px' },
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: { xs: '100vw', md: '360px' },
					boxSizing: 'border-box',
					mt: { xs: '56px', sm: '64px' },
				},

				zIndex: 0,
			}}
			variant={isDownMd ? 'temporary' : 'permanent'}
			anchor='right'
			open={open}
		>
			<Stack spacing={2} alignItems='center' sx={{ mt: '16px' }}>
				<IconButton onClick={() => setOpen(false)}>
					<ChevronRightIcon />
				</IconButton>
				<Avatar
					src={selectedFriend.avatar}
					sx={{ height: '80px', width: '80px' }}
				/>
				<Typography variant='h5'>{selectedFriend.userName}</Typography>

				<Stack spacing={3} direction='row' justifyContent='space-around'>
					<Stack justifyContent='center' alignItems='center' spacing={1}>
						<IconButton
							onClick={handleUnfriend}
							sx={{ p: 0, height: 36, width: 36 }}
						>
							<Avatar sx={{ bgcolor: red[600] }}>
								<PersonRemoveIcon />
							</Avatar>
						</IconButton>
						<Typography variant='subtitle2'>Unfriend</Typography>
					</Stack>
				</Stack>
			</Stack>
		</Drawer>
	);
};

export default FriendDetails;
