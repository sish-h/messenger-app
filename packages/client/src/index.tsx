import { Avatar } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { RecoilRoot, useRecoilCallback } from 'recoil';
import App from './App';

const IS_DEV = process.env.NODE_ENV === 'development';

const DebugButton = () => {
	const onClick = useRecoilCallback(
		({ snapshot }) =>
			async () => {
				console.debug('Atom values:');
				for (const node of snapshot.getNodes_UNSTABLE()) {
					const value = await snapshot.getPromise(node);
					console.debug(node.key, value);
				}
			},
		[]
	);

	return (
		<Avatar
			sx={{
				position: 'fixed',
				cursor: 'pointer',
				left: 64,
				bottom: 12,
				zIndex: 99999,
				opacity: 0.5,
			}}
			src='https://recoiljs.org/img/favicon.png'
			onClick={onClick}
		/>
	);
};

const queryClient = new QueryClient({
	defaultOptions: { queries: { suspense: true, useErrorBoundary: false } },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RecoilRoot>
			{IS_DEV && <DebugButton />}
			<QueryClientProvider client={queryClient}>
				<App />
				{IS_DEV && <ReactQueryDevtools initialIsOpen={false} />}
			</QueryClientProvider>
		</RecoilRoot>
	</React.StrictMode>
);
