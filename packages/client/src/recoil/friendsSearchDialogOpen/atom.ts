import { atom } from 'recoil';

const friendsSearchDialogOpenState = atom<boolean>({
	key: 'friendsSearchDialogOpenState',
	default: false,
});

export default friendsSearchDialogOpenState;
