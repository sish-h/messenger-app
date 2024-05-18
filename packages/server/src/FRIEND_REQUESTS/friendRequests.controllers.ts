import { IAsyncRequestHandler } from '../common/interfaces';
import { catchAsyncReqHandlerErr } from '../common/middleware';
import { documentIdValidationSchema } from '../common/validation';
import friendRequestModel from '../FRIEND_REQUESTS/friendRequests.model';
import userModel from '../USERS/users.model';
import { TFriendRequestInput } from './friendRequests.types';

const sendFriendRequestUnsafe: IAsyncRequestHandler = async (req, res) => {
	const userId = req.currentUserId as string;
	const { value: friendId, error } = documentIdValidationSchema.validate(
		req.params.friendId
	);
	if (error) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}
	if (userId === friendId) {
		res.status(400).json({ error: 'you cant sent a request to your self' });
		return;
	}
	const user = await userModel.findById(userId);
	const friend = await userModel.findById(friendId);
	if (!user || !friend) {
		res.status(400).json({ error: 'user or friend not found' });
		return;
	}

	const isFriend = user.friends.indexOf(friendId) !== -1;
	if (isFriend) {
		res.status(400).json({ error: 'already a friend' });
		return;
	}

	const friendRequest = await friendRequestModel.findOne({
		recipient: friendId,
		requester: userId,
		status: 'pending',
	});
	if (friendRequest) {
		res.status(400).json({ error: 'friend request already sent' });
		return;
	}

	await friendRequestModel.create<TFriendRequestInput>({
		recipient: friendId,
		requester: userId,
		status: 'pending',
	});

	res.status(200).json({ succuss: 'friend request sent' });
};

const getSentFriendRequestUnsafe: IAsyncRequestHandler = async (req, res) => {
	const userId = req.currentUserId as string;
	const friendRequests = await friendRequestModel.find({
		requester: userId,
		status: 'pending',
	});
	res.status(200).json(friendRequests);
};

const getReceivedFriendRequestUnsafe: IAsyncRequestHandler = async (
	req,
	res
) => {
	const userId = req.currentUserId as string;
	const friendRequests = await friendRequestModel.find({
		recipient: userId,
		status: 'pending',
	});
	res.status(200).json(friendRequests);
};

const acceptFriendRequestUnsafe: IAsyncRequestHandler = async (req, res) => {
	const userId = req.currentUserId as string;
	const { value: friendRequestId, error } = documentIdValidationSchema.validate(
		req.params.requestId
	);

	if (error) {
		res.status(400).json({ error: 'invalid request id' });
		return;
	}

	const friendRequest = await friendRequestModel.findById(friendRequestId);
	if (
		!friendRequest ||
		friendRequest.recipient !== userId ||
		friendRequest.status !== 'pending'
	) {
		res
			.status(400)
			.json({ error: 'request was not sent to you or is no longer pending' });
		return;
	}

	const user = await userModel.findById(friendRequest.requester);
	const friend = await userModel.findById(friendRequest.recipient);
	if (!user || !friend) {
		res.status(400).json({ error: 'user or friend not found' });
		return;
	}

	user.friends.push(friendRequest.recipient);
	friend.friends.push(friendRequest.requester);
	friendRequest.status = 'accepted';

	await Promise.all([friendRequest.save(), user.save(), friend.save()]);

	res.status(200).json({ succuss: 'friend request accepted' });
};

const rejectFriendRequestUnsafe: IAsyncRequestHandler = async (req, res) => {
	const userId = req.currentUserId as string;
	const { value: friendRequestId, error } = documentIdValidationSchema.validate(
		req.params.requestId
	);

	if (error) {
		res.status(400).json({ error: 'invalid request id' });
		return;
	}

	const friendRequest = await friendRequestModel.findById(friendRequestId);
	if (!friendRequest || friendRequest.recipient !== userId) {
		res.status(400).json({ error: 'request was not sent to you' });
		return;
	}

	const user = await userModel.findById(friendRequest.recipient);
	const friend = await userModel.findById(friendRequest.recipient);
	if (!user || !friend) {
		res.status(400).json({ error: 'user or friend not found' });
		return;
	}

	friendRequest.status = 'rejected';

	await friendRequest.save();

	res.status(200).json({ succuss: 'friend request accepted' });
};

export const sendFriendRequest = catchAsyncReqHandlerErr(
	sendFriendRequestUnsafe
);
export const getSentFriendRequest = catchAsyncReqHandlerErr(
	getSentFriendRequestUnsafe
);
export const getReceivedFriendRequest = catchAsyncReqHandlerErr(
	getReceivedFriendRequestUnsafe
);

export const acceptFriendRequest = catchAsyncReqHandlerErr(
	acceptFriendRequestUnsafe
);

export const rejectFriendRequest = catchAsyncReqHandlerErr(
	rejectFriendRequestUnsafe
);
