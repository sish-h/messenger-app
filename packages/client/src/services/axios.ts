import axios from 'axios';
import { API_ORIGIN } from '../constants/envVars';

export const axiosInstance = axios.create({
	baseURL: API_ORIGIN,
});
