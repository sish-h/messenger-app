import { axiosInstance } from '../services/axios';

const logoutReq = async () =>
	await axiosInstance.delete('/users/logout', { withCredentials: true });

const useLogout = () => {
	const logout = () => {
		try {
			logoutReq();
		} catch (error) {}
		localStorage.clear();
		window.location.reload();
	};

	return logout;
};

export default useLogout;
