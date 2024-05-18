import { atom } from 'recoil';
import { TCurrentUser } from '../../common/types';
import currentUserPersistEffect from './effect';

const currentUserState = atom<TCurrentUser | null>({
	key: 'currentUserState',
	default: null,
	effects: [currentUserPersistEffect],
});

export default currentUserState;
