import { atom } from 'recoil';

const typingState = atom<Map<string, boolean>>({
	key: 'typingState',
	default: new Map(),
});

export default typingState;
