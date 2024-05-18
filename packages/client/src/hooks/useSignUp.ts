import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { TSignUpInput } from '../common/types';
import { signUpValidationSchema } from '../common/validation';
import { axiosInstance } from '../services/axios';

const signUp = async (signUpInput: TSignUpInput): Promise<unknown> => {
	const { confirmEmail, confirmPassword, ...payload } = signUpInput;
	const { data } = await axiosInstance.post(`/users/signup`, payload, {
		withCredentials: true,
	});
	return data;
};

const useSignUp = () => {
	const useFormReturn = useForm<TSignUpInput>({
		resolver: yupResolver(signUpValidationSchema),
	});
	const useMutationReturn = useMutation(signUp);

	useEffect(() => {
		if (useMutationReturn.isSuccess) useFormReturn.reset();
	}, [useFormReturn, useMutationReturn.isSuccess]);

	const onSubmit = useFormReturn.handleSubmit((signUpInput) =>
		useMutationReturn.mutate(signUpInput)
	);

	return { useFormReturn, useMutationReturn, onSubmit };
};

export default useSignUp;
