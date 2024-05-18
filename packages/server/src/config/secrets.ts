import dotenv from 'dotenv';
import fs from 'fs';
import { logError } from '../common/utils';

export const IS_PROD = process.env.NODE_ENV === 'production';

if (fs.existsSync('.env')) {
	console.log('Using .env file to supply config environment variables');
	dotenv.config({ path: '.env' });
} else if (IS_PROD) {
	console.log(
		'Using production env vars file to supply config environment variables'
	);
} else if (fs.existsSync('.env.development')) {
	console.log(
		'Using .env.development file to supply config environment variables'
	);
	dotenv.config({ path: '.env.development' });
} else {
	logError('No ENV file was provided');
	process.exit(1);
}

const getEnvVar = (envVarName: string): string => {
	const envVar = process.env[envVarName];
	if (!envVar) {
		logError(`Set ${envVarName} environment variable.`);
		process.exit(1);
	}
	return envVar;
};

export const PORT = getEnvVar('PORT');
export const COOKIE_SECRET = getEnvVar('COOKIE_SECRET');
export const JWT_SECRET = getEnvVar('JWT_SECRET');
export const MONGODB_URI = getEnvVar('MONGODB_URI');
export const CLIENT_ORIGIN = !IS_PROD ? getEnvVar('CLIENT_ORIGIN') : '';
