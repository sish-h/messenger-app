import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { TCurrentUser, TLoginInput } from '../common/types';
import { loginValidationSchema } from '../common/validation';
import currentUserState from '../recoil/currentUser/atom';
import { axiosInstance } from '../services/axios';

const login = async (loginInput: TLoginInput): Promise<TCurrentUser> => {
	const { data } = await axiosInstance.post(`/users/login`, loginInput, {
		withCredentials: true,
	});
	return data;
};

const useLogin = () => {
	const useFormReturn = useForm<TLoginInput>({
		resolver: yupResolver(loginValidationSchema),
	});
	const useMutationResult = useMutation<TCurrentUser, AxiosError, TLoginInput>(
		login
	);

	const onSubmit = useFormReturn.handleSubmit((loginInput) =>
		useMutationResult.mutate(loginInput)
	);

	const setCurrentUser = useSetRecoilState(currentUserState);

	useEffect(() => {
		if (useMutationResult.isSuccess) {
			setCurrentUser(useMutationResult.data);
			axiosInstance.defaults.headers.common['csrf-token'] =
				useMutationResult.data.csrfToken;
		}
	}, [setCurrentUser, useMutationResult.data, useMutationResult.isSuccess]);

	return { useFormReturn, useMutationResult, onSubmit };
};

export default useLogin;
