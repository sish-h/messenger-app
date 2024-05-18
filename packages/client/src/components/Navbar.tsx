import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDownRounded';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightModeRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import { Box, Button, ListItemIcon, ListItemText } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import queryKeys from '../constants/reactQueryKeys';
import { getReceivedFriendRequests } from '../hooks/useFriendRequest';
import useLogout from '../hooks/useLogout';
import currentUserState from '../recoil/currentUser/atom';
import friendsSearchDialogOpenState from '../recoil/friendsSearchDialogOpen/atom';
import themeState from '../recoil/theme/atom';

const Navbar = () => {
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const [theme, setTheme] = useRecoilState(themeState);

	const handleToggleTheme = () => {
		setTheme((currVal) => ({
			isUserPicked: true,
			mode: currVal.mode === 'dark' ? 'light' : 'dark',
		}));
	};

	const currentUser = useRecoilValue(currentUserState);

	const logout = useLogout();
	const handleLogout = () => logout();

	const setOpen = useSetRecoilState(friendsSearchDialogOpenState);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const { data: friendsRequests } = useQuery(
		queryKeys.receivedFriendRequests,
		getReceivedFriendRequests,
		{ suspense: false }
	);

	return (
		<AppBar position='sticky' elevation={0} color='inherit' variant='outlined'>
			<Toolbar>
				<Box
					component='img'
					src='./logo192.png'
					sx={{ width: '40px', height: '40px', mr: '5px' }}
				/>
				<Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
					Messenger
				</Typography>

				<Button
					sx={{
						display: { xs: 'none', sm: 'flex' },
						mx: '5px',
						borderRadius: '24px',
						textTransform: 'none',
						fontWeight: 'bold',
					}}
					variant='text'
					startIcon={<Avatar alt='Avatar' src={currentUser?.avatar} />}
				>
					{currentUser?.userName}
				</Button>

				<Tooltip
					sx={{ display: { sm: 'none' } }}
					title={currentUser?.userName ?? ''}
				>
					<Avatar alt='Avatar' src={currentUser?.avatar} />
				</Tooltip>

				<Tooltip title='Lookup Friends'>
					<IconButton onClick={handleClickOpen} sx={{ p: 0, ml: '5px' }}>
						<Badge
							color='primary'
							overlap='circular'
							anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
							badgeContent={friendsRequests?.length}
						>
							<Avatar>
								<PeopleAltRoundedIcon />
							</Avatar>
						</Badge>
					</IconButton>
				</Tooltip>

				<Tooltip title='Open settings'>
					<IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: '5px' }}>
						<Avatar>
							<ArrowDropDownIcon />
						</Avatar>
					</IconButton>
				</Tooltip>
				<Menu
					sx={{ mt: '50px' }}
					id='menu-appBar'
					anchorEl={anchorElUser}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					keepMounted
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={Boolean(anchorElUser)}
					onClose={handleCloseUserMenu}
				>
					<MenuItem onClick={handleCloseUserMenu}>
						<ListItemIcon>
							<SettingsIcon fontSize='small' />
						</ListItemIcon>
						<ListItemText>Settings</ListItemText>
					</MenuItem>
					<MenuItem onClick={handleToggleTheme}>
						<ListItemIcon>
							{theme.mode === 'light' ? (
								<DarkModeIcon fontSize='small' />
							) : (
								<LightModeIcon fontSize='small' />
							)}
						</ListItemIcon>
						<ListItemText>
							{theme.mode === 'light' ? 'Dark Mode' : 'Light Mode'}
						</ListItemText>
					</MenuItem>
					<MenuItem onClick={handleLogout}>
						<ListItemIcon>
							<LogoutIcon fontSize='small' />
						</ListItemIcon>
						<ListItemText>Log Out</ListItemText>
					</MenuItem>
				</Menu>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
