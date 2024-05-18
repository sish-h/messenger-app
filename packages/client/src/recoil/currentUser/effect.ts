import { AtomEffect } from 'recoil';
import { TCurrentUser } from '../../common/types';
import { axiosInstance } from '../../services/axios';

const currentUserPersistEffect: AtomEffect<TCurrentUser | null> = ({
	setSelf,
	onSet,
}) => {
	const savedValue = localStorage.getItem('currentUserState');
	if (savedValue && savedValue !== 'null') {
		const currentUser: TCurrentUser = JSON.parse(savedValue);
		axiosInstance.defaults.headers.common['csrf-token'] = currentUser.csrfToken;
		setSelf(currentUser);
	}

	onSet((newValue, _, isReset) => {
		isReset
			? localStorage.removeItem('currentUserState')
			: localStorage.setItem('currentUserState', JSON.stringify(newValue));
	});
};

export default currentUserPersistEffect;
