import { yupResolver } from '@hookform/resolvers/yup';
import { IChatMsg } from '@messaging-app/shared';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import {
	alpha,
	Avatar,
	Container,
	IconButton,
	InputAdornment,
	InputBase,
	Paper,
	Stack,
	styled,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {} from '../../common/interfaces';
import { chatMsgSchema } from '../../common/validation';
import useGetConversation from '../../hooks/useGetConversation';
import useSendMessage from '../../hooks/useSendMessage';
import { useTypingNotification } from '../../hooks/useTypingNotification';
import currentUserState from '../../recoil/currentUser/atom';
import friendDetailsOpenState from '../../recoil/friendDetailsOpen/atom';
import selectedFriendState from '../../recoil/selectedFriend/atom';
import typingState from '../../recoil/typing/atom';
import TypingIndicator from '../TypingIndicator/index';

const ChatMsgPaper = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#383838' : '#e4e6eb',
	borderRadius: '16px',
}));

const OwmChatMsgPaper = styled(Paper)(({ theme }) => ({
	backgroundColor: '#0084ff',
	color: 'white',
	borderRadius: '16px',
}));

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

interface IChatMsgProps {
	isOwn: boolean;
	text: string;
	avatar: string | undefined;
}

const ChatMsg = ({ isOwn, text, avatar }: IChatMsgProps) => {
	return isOwn ? (
		<Stack
			direction='row'
			spacing={1}
			sx={{ maxWidth: '600px', alignSelf: 'flex-end' }}
		>
			<OwmChatMsgPaper sx={{ px: '12px', py: '8px' }} elevation={0}>
				<Typography variant='body2'>{text}</Typography>
			</OwmChatMsgPaper>
			<Avatar
				src={avatar}
				sx={{ alignSelf: 'flex-end', width: '28px', height: '28px' }}
			/>
		</Stack>
	) : (
		<Stack direction='row' spacing={1} sx={{ maxWidth: '600px' }}>
			<Avatar
				src={avatar}
				sx={{ alignSelf: 'flex-end', width: '28px', height: '28px' }}
			/>
			<ChatMsgPaper sx={{ px: '12px', py: '8px' }} elevation={0}>
				<Typography variant='body2'>{text}</Typography>
			</ChatMsgPaper>
		</Stack>
	);
};

const ChatBox = () => {
	const [messages, setMessages] = useState<IChatMsg[]>([]);
	const typingMap = useRecoilValue(typingState);
	const currentUser = useRecoilValue(currentUserState);
	const selectedFriend = useRecoilValue(selectedFriendState);
	const { data, isSuccess } = useGetConversation(selectedFriend?.id);
	const { register, handleSubmit, reset } = useForm({
		resolver: yupResolver(chatMsgSchema),
	});
	const { mutate } = useSendMessage();

	const onSubmit = handleSubmit(({ text }) => {
		if (!selectedFriend || !currentUser) return;
		mutate({
			text,
			senderId: currentUser.id,
			targetId: selectedFriend.id,
		});
		reset();
	});

	useEffect(() => {
		if (isSuccess) setMessages(data);
	}, [data, isSuccess]);

	const setFriendDetailsOpen = useSetRecoilState(friendDetailsOpenState);
	const handleOpenFriendDetails = () =>
		setFriendDetailsOpen((oldVal) => !oldVal);

	const { handleInputKeyDown, handleInputKeyUp } = useTypingNotification(
		selectedFriend?.id
	);

	return selectedFriend ? (
		<Stack sx={{ flexGrow: 1 }}>
			<Paper sx={{ p: '12px' }} elevation={0}>
				<Stack direction='row' alignItems='center' spacing={2}>
					<Avatar src={selectedFriend?.avatar} />
					<Typography sx={{ flexGrow: 1 }} variant='body1'>
						{selectedFriend?.userName}
					</Typography>
					<IconButton onClick={handleOpenFriendDetails}>
						<InfoRoundedIcon color='primary' />
					</IconButton>
				</Stack>
			</Paper>
			<Stack
				component={Paper}
				elevation={0}
				spacing={1}
				sx={{ p: '14px', overflowY: 'auto', height: 'calc(100vh - 194px)' }}
				direction='column-reverse'
			>
				{typingMap.get(selectedFriend.id) && (
					<Stack direction='row' spacing={1} sx={{ maxWidth: '600px' }}>
						<Avatar
							src={selectedFriend.avatar}
							sx={{ alignSelf: 'flex-end', width: '28px', height: '28px' }}
						/>
						<ChatMsgPaper sx={{ px: '24px', py: '14px' }} elevation={0}>
							<TypingIndicator />
						</ChatMsgPaper>
					</Stack>
				)}
				{messages
					?.slice()
					.reverse()
					.map((message) => (
						<ChatMsg
							avatar={
								currentUser?.id === message.senderId
									? currentUser.avatar
									: selectedFriend?.avatar
							}
							key={message.id}
							isOwn={currentUser?.id === message.senderId}
							text={message.text}
						/>
					))}
			</Stack>
			<Paper sx={{ p: '12px' }} elevation={0}>
				<Stack
					component='form'
					onSubmit={onSubmit}
					justifyContent='space-between'
					direction='row'
				>
					<IconButton aria-label='add'>
						<AddCircleIcon color='primary' />
					</IconButton>
					<CustomInput
						onKeyDown={handleInputKeyDown}
						onKeyUp={handleInputKeyUp}
						autoComplete='off'
						placeholder='Aa'
						inputProps={{ 'aria-label': 'chat' }}
						{...register('text')}
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
	) : (
		<Container
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: 'calc(100vh - 64px)',
				flexDirection: 'column',
			}}
		>
			<Typography maxWidth='35rem' textAlign='center' variant='h2'>
				Select or add a friend to chat with
			</Typography>
		</Container>
	);
};

export default ChatBox;
