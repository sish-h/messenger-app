import {
	Drawer,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Skeleton,
} from '@mui/material';

const FriendsListSkeleton = () => (
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
			{[...Array(10).keys()].map((_, idx) => (
				<ListItem key={idx} button>
					<ListItemAvatar>
						<Skeleton variant='circular' width={55} height={55} />
					</ListItemAvatar>

					<ListItemText>
						<Skeleton
							variant='text'
							height={50}
							sx={{ display: { xs: 'none', md: 'inherit' }, ml: '12px' }}
						/>
					</ListItemText>
				</ListItem>
			))}
		</List>
	</Drawer>
);

export default FriendsListSkeleton;
