import cookie from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import path from 'path';
import WebSocket from 'ws';
import { handleCsrfErr } from '../common/middleware';
import friendRequestRouter from '../FRIEND_REQUESTS/friendRequests.router';
import messagesRouter from '../MESSAGES/messages.router';
import usersRouter from '../USERS/users.router';
import { CLIENT_ORIGIN, COOKIE_SECRET, IS_PROD } from './secrets';

const app = express();

// Enabling helmet
app.use(helmet({ contentSecurityPolicy: false }));

// Prevent http param pollution
app.use(hpp());

//parse json body
app.use(express.json());

// Limiting each IP to 100 requests per windowMs
if (IS_PROD) {
	const limiter = rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100,
	});

	app.use('/api', limiter);
}

//config cors
if (!IS_PROD) app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

// Dev logging middleware
if (!IS_PROD) {
	app.use(morgan('dev'));
}

//Hash map of userIds as key and socket connection as values
export const socketConnections = new Map<string, WebSocket.WebSocket>();

//Set up cookie parser
export const cookieParser = cookie(COOKIE_SECRET);
app.use(cookieParser);

app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/friend-requests', friendRequestRouter);

// Serve static assets in production
if (IS_PROD) {
	app.use(express.static(path.join(__dirname, '../../../client/build')));
	app.get('/', function (req, res) {
		res.sendFile(path.join(__dirname, '../../../client/build', 'index.html'));
	});
}

//set csurf error
app.use(handleCsrfErr);

export default app;
