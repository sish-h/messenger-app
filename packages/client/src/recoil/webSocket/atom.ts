import { atom } from 'recoil';

const webSocketState = atom<WebSocket | null>({
	key: 'webSocketState',
	default: null,
});

export default webSocketState;
