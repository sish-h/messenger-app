import csurf from 'csurf';
import { ErrorRequestHandler, RequestHandler } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { IS_PROD, JWT_SECRET } from '../config/secrets';
import { MESSAGE_INPUT } from '../MESSAGES/messages.strings';
import {
	COOKIE_NAME,
	LOGIN_INPUT,
	SIGNUP_INPUT,
	UPDATE_USER_INPUT,
	USER_IDS,
} from '../USERS/users.strings';
import { IAsyncRequestHandler, isErrorWithCode } from './interfaces';
import { DOCUMENT_IDS } from './strings';

type TValidInputKeys =
	| typeof USER_IDS
	| typeof LOGIN_INPUT
	| typeof SIGNUP_INPUT
	| typeof UPDATE_USER_INPUT
	| typeof MESSAGE_INPUT
	| typeof DOCUMENT_IDS;

export const validateInput =
	(
		validationSchema: Joi.AnySchema,
		validInputKey: TValidInputKeys
	): RequestHandler =>
	(req, res, next) => {
		const { error, value } = validationSchema.validate(req.body);
		if (error) {
			res.status(400).json({
				error: 'validation error',
			});
			return;
		}

		req[validInputKey] = value;
		next();
	};

export const catchAsyncReqHandlerErr =
	(
		handler: IAsyncRequestHandler,
		errHandler?: ErrorRequestHandler
	): IAsyncRequestHandler =>
	(req, res, next) =>
		handler(req, res, next).catch((err) =>
			errHandler ? errHandler(err, req, res, next) : next(err)
		);

export const authenticate: RequestHandler = async (req, res, next) => {
	try {
		const currentUserId = jwt
			.verify(req.signedCookies[COOKIE_NAME], JWT_SECRET)
			.toString();
		req.currentUserId = currentUserId;
		next();
	} catch (_error) {
		res.clearCookie(COOKIE_NAME);
		res.status(403).json({ error: 'invalid cookie' });
	}
};

export const handleCsrfErr: ErrorRequestHandler = (err, req, res, next) => {
	if (isErrorWithCode(err)) {
		if (err.code === 'EBADCSRFTOKEN') {
			res.clearCookie('token');
			res.status(403).json({ error: 'form tampered with' });
			return;
		}
	}

	if (err instanceof Error) {
		res.status(500).json({
			error: 'internal server error',
		});
		next(err);
	}
};

export const csrfLogin = csurf({
	ignoreMethods: ['POST'],
	cookie: {
		httpOnly: true,
		signed: true,
		secure: IS_PROD,
		sameSite: 'strict',
	},
});

export const csrfProtection = csurf({
	cookie: {
		httpOnly: true,
		signed: true,
		secure: IS_PROD,
		sameSite: 'strict',
	},
});
