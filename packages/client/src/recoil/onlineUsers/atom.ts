import { atom } from 'recoil';

const onlineUsersState = atom<string[]>({
	key: 'onlineUsersState',
	default: [],
});

export default onlineUsersState;
