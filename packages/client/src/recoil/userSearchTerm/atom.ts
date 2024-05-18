import { atom } from 'recoil';

const userSearchTermState = atom<string>({
	key: 'userSearchTerm',
	default: '',
});

export default userSearchTermState;
