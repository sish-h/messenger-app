import { Router } from 'express';
import { authenticate } from '../common/middleware';
import {
	acceptFriendRequest,
	getReceivedFriendRequest,
	getSentFriendRequest,
	rejectFriendRequest,
	sendFriendRequest,
} from './friendRequests.controllers';

const friendRequestRouter = Router();

friendRequestRouter.post('/send/:friendId', authenticate, sendFriendRequest);
friendRequestRouter.get('/sent', authenticate, getSentFriendRequest);
friendRequestRouter.get('/received', authenticate, getReceivedFriendRequest);
friendRequestRouter.put(
	'/accept/:requestId',
	authenticate,
	acceptFriendRequest
);
friendRequestRouter.put(
	'/reject/:requestId',
	authenticate,
	rejectFriendRequest
);

export default friendRequestRouter;
