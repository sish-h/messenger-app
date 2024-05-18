import AddCircleIcon from '@mui/icons-material/AddCircle';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import {
	alpha,
	IconButton,
	InputAdornment,
	InputBase,
	Paper,
	Skeleton,
	Stack,
	styled,
} from '@mui/material';
import {} from '../../common/interfaces';

const CustomInput = styled(InputBase)(({ theme }) => ({
	position: 'relative',
	borderRadius: '50px',
	width: '100%',
	marginInline: '16px',
	height: '36px',
	backgroundColor: alpha(theme.palette.action.active, 0.1),
	'&:hover': {
		backgroundColor: alpha(theme.palette.action.active, 0.15),
	},
	'& .MuiInputBase-input': {
		paddingInline: '10px',
	},
}));

const SkeletonChatMsg = ({ isOwn }: { isOwn: boolean }) => {
	return isOwn ? (
		<Stack
			direction='row'
			spacing={1}
			sx={{ maxWidth: '600px', alignSelf: 'flex-end' }}
		>
			<Skeleton
				variant='rectangular'
				height={37}
				width={185}
				sx={{ borderRadius: 16 }}
			/>
			<Skeleton
				variant='circular'
				sx={{ alignSelf: 'flex-end', width: '28px', height: '28px' }}
			/>
		</Stack>
	) : (
		<Stack direction='row' spacing={1} sx={{ maxWidth: '600px' }}>
			<Skeleton
				variant='circular'
				sx={{ alignSelf: 'flex-end', width: '28px', height: '28px' }}
			/>
			<Skeleton
				variant='rectangular'
				height={37}
				width={185}
				sx={{ borderRadius: 16 }}
			/>
		</Stack>
	);
};

const ChatBoxSkeleton = () => (
	<Stack sx={{ flexGrow: 1 }}>
		<Paper sx={{ p: '12px' }} elevation={0}>
			<Stack direction='row' alignItems='center' spacing={2}>
				<Skeleton variant='circular' width={40} height={40} />
				<Skeleton height={35} width={120} />
			</Stack>
		</Paper>
		<Stack
			component={Paper}
			elevation={0}
			spacing={1}
			sx={{ p: '14px', overflowY: 'auto', height: 'calc(100vh - 194px)' }}
			direction='column-reverse'
		>
			{[...Array(20).keys()].map((_, idx) => (
				<SkeletonChatMsg key={idx} isOwn={idx % 2 === 0} />
			))}
		</Stack>
		<Paper sx={{ p: '12px' }} elevation={0}>
			<Stack justifyContent='space-between' direction='row'>
				<IconButton aria-label='add'>
					<AddCircleIcon color='primary' />
				</IconButton>
				<CustomInput
					autoComplete='off'
					placeholder='Aa'
					inputProps={{ 'aria-label': 'chat' }}
					disabled={true}
					endAdornment={
						<InputAdornment position='end'>
							<IconButton sx={{ height: '28px', width: '28px', mr: '4px' }}>
								<EmojiEmotionsIcon color='primary' />
							</IconButton>
						</InputAdornment>
					}
				/>
				<IconButton aria-label='like' type='submit'>
					<SendRoundedIcon color='primary' />
				</IconButton>
			</Stack>
		</Paper>
	</Stack>
);

export default ChatBoxSkeleton;
