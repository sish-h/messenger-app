import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { alpha, Dialog, styled } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import { TransitionProps } from '@mui/material/transitions';
import { debounce } from 'lodash';
import React, { Suspense, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import friendsSearchDialogOpenState from '../../recoil/friendsSearchDialogOpen/atom';
import userSearchTermState from '../../recoil/userSearchTerm/atom';
import Loading from '../Loading';
import ReceivedRequests from './ReceivedRequests';
import SearchResults from './SearchResults';
import SentRequests from './SentRequests';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction='up' ref={ref} {...props} />;
});

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(3),
		width: 'auto',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '20ch',
		},
	},
}));

const FriendSearch = () => {
	const [open, setOpen] = useRecoilState(friendsSearchDialogOpenState);

	const handleClose = () => {
		setOpen(false);
	};

	const [userName, setUserName] = useState('');
	const [delayedUserName, setDelayedUserName] =
		useRecoilState(userSearchTermState);

	const debounceSearch = debounce(
		(searchTerm: string) => setDelayedUserName(searchTerm),
		1000,
		{ leading: false, trailing: true }
	);

	useEffect(() => {
		debounceSearch(userName);
		return () => debounceSearch.cancel();
	}, [debounceSearch, userName]);

	return (
		<Dialog
			fullScreen
			open={open}
			onClose={handleClose}
			TransitionComponent={Transition}
		>
			<AppBar sx={{ position: 'relative' }} color='inherit'>
				<Toolbar>
					<IconButton
						edge='start'
						color='inherit'
						onClick={handleClose}
						aria-label='close'
					>
						<CloseIcon />
					</IconButton>
					<Search sx={{ ml: 2 }}>
						<SearchIconWrapper>
							<SearchIcon />
						</SearchIconWrapper>
						<StyledInputBase
							placeholder='Find a friend...'
							inputProps={{ 'aria-label': 'search' }}
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
						/>
					</Search>
				</Toolbar>
			</AppBar>
			<Suspense fallback={<Loading />}>
				<SearchResults searchTerm={delayedUserName} />
			</Suspense>
			<Suspense fallback={<Loading />}>
				<ReceivedRequests />
			</Suspense>
			<Suspense fallback={<Loading />}>
				<SentRequests />
			</Suspense>
		</Dialog>
	);
};

export default FriendSearch;
