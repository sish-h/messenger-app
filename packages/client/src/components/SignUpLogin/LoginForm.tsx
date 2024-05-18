import {
	SwitchAccount as SwitchAccountIcon,
	Visibility,
	VisibilityOff,
} from '@mui/icons-material';
import {
	Button,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Paper,
	Stack,
	Typography,
} from '@mui/material';
import { useState } from 'react';
import useLogin from '../../hooks/useLogin';
import MockAccountsList from './MockAccountsList';

const LoginForm = () => {
	const {
		useFormReturn: {
			register,
			formState: { errors },
		},
		useMutationResult: { isLoading, status, isError, error, mutate },
		onSubmit,
	} = useLogin();

	const [showPassword, setShowPassword] = useState(false);
	const handleToggleShowPassword = () => setShowPassword((prev) => !prev);

	const [openMockAccountsList, setMockAccountsList] = useState(false);
	const handleOpenOpenMockAccountsList = () => setMockAccountsList(true);
	const handleCloseOpenMockAccountsList = () => setMockAccountsList(false);

	let btnText = 'log in';
	switch (status) {
		case 'idle':
			btnText = 'log in';
			break;
		case 'loading':
			btnText = 'logging in...';
			break;
		case 'error':
			btnText = error?.response?.data?.error ?? 'something went wrong';
			break;
		default:
			break;
	}

	return (
		<>
			<Paper sx={{ p: '20px', width: '360px' }}>
				<Stack spacing={2} component='form' onSubmit={onSubmit}>
					<Typography align='center' variant='h5'>
						Login
					</Typography>
					<FormControl variant='outlined' error={Boolean(errors.email)}>
						<InputLabel htmlFor='email'>Email</InputLabel>
						<OutlinedInput
							id='email'
							label='Email'
							{...register('email')}
							disabled={isLoading}
						/>
						<FormHelperText id='email'>{errors.email?.message}</FormHelperText>
					</FormControl>

					<FormControl variant='outlined' error={Boolean(errors.password)}>
						<InputLabel htmlFor='password'>Password</InputLabel>
						<OutlinedInput
							id='password'
							label='Password'
							type={showPassword ? 'text' : 'password'}
							{...register('password')}
							disabled={isLoading}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle password visibility'
										onClick={handleToggleShowPassword}
										edge='end'
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
						/>
						<FormHelperText id='password'>
							{errors.password?.message}
						</FormHelperText>
					</FormControl>

					<Button
						variant='contained'
						size='large'
						type='submit'
						disabled={isLoading}
						color={isError ? 'error' : 'primary'}
					>
						{btnText}
					</Button>
					<Button
						variant='contained'
						size='large'
						color='warning'
						startIcon={<SwitchAccountIcon />}
						onClick={handleOpenOpenMockAccountsList}
					>
						Mock Accounts
					</Button>
					<Button disabled={true} variant='text' size='small'>
						Forget password?
					</Button>
				</Stack>
			</Paper>
			<MockAccountsList
				handleCloseOpenMockAccountsList={handleCloseOpenMockAccountsList}
				openMockAccountsList={openMockAccountsList}
				mutate={mutate}
			/>
		</>
	);
};

export default LoginForm;
