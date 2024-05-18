import { Error } from '@mui/icons-material';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
	children?: ReactNode;
}

interface State {
	hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(_: Error): State {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
	}

	private handleReloadApp() {
		window.location.reload();
	}

	private handleResetApp() {
		localStorage.clear();
		window.location.reload();
	}

	public render() {
		if (this.state.hasError) {
			return (
				<Box
					display='flex'
					justifyContent='center'
					alignItems='center'
					height='100vh'
				>
					<Paper
						sx={{
							p: '1.5rem',
							display: 'flex',
							alignItems: 'center',
							flexDirection: 'column',
							gap: '0.5rem',
						}}
					>
						<Error color='error' sx={{ height: '5rem', width: '5rem' }} />
						<Typography variant='h4'>Sorry.. there was an error</Typography>
						<Stack
							width='100%'
							flexDirection='row'
							justifyContent='space-between'
							mt='1rem'
						>
							<Button
								size='large'
								variant='outlined'
								color='info'
								onClick={this.handleReloadApp}
							>
								Reload App
							</Button>
							<Button
								size='large'
								variant='outlined'
								color='error'
								onClick={this.handleResetApp}
							>
								Reset App
							</Button>
						</Stack>
					</Paper>
				</Box>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
