import express from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from '../USERS/users.strings';
import app, { cookieParser } from './app';
import { JWT_SECRET } from './secrets';
import wss from './socket';

const server = http.createServer(app);

server.on('upgrade', async (request, socket, head) => {
	console.log('Parsing cookie 🍪 from request...');

	const req = request as express.Request;
	const res = {} as express.Response;

	try {
		cookieParser(req, res, () => {
			const currentUserId = jwt
				.verify(req.signedCookies[COOKIE_NAME], JWT_SECRET)
				.toString();
			req.currentUserId = currentUserId;

			console.log('Cookie 🍪 is parsed!');

			wss.handleUpgrade(req, socket, head, (ws) => {
				wss.emit('connection', ws, request);
			});
		});
	} catch (err) {
		socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
		socket.destroy();
	}
});

export default server;
