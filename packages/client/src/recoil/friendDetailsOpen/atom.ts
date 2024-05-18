import { atom } from 'recoil';

const friendDetailsOpenState = atom<boolean>({
	key: 'friendDetailsOpenState',
	default: false,
});

export default friendDetailsOpenState;
