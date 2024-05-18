import bcrypt from 'bcryptjs';
import { ErrorRequestHandler, RequestHandler } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';
import { IAsyncRequestHandler, isErrorWithCode } from '../common/interfaces';
import { catchAsyncReqHandlerErr } from '../common/middleware';
import { documentIdValidationSchema } from '../common/validation';
import { socketConnections } from '../config/app';
import { IS_PROD, JWT_SECRET } from '../config/secrets';
import friendRequestsModel from '../FRIEND_REQUESTS/friendRequests.model';
import userModel from './users.model';
import { COOKIE_NAME } from './users.strings';

const signupErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
	if (isErrorWithCode(err)) {
		if (err.code === 11000) {
			res.status(500).json({
				error: 'username already used',
			});
			return;
		}
	}
	next(err);
};

const signupUnsafe: IAsyncRequestHandler = async (req, res) => {
	await userModel.create(req.signupInput);
	res.status(200).json({
		success: 'user created successfully',
	});
};

const loginUnsafe: IAsyncRequestHandler = async (req, res) => {
	const loginInput = req.loginInput;
	const user = await userModel.findOne({ email: loginInput?.email });
	if (!user || !loginInput) {
		res.status(400).json({ error: 'wrong password or username' });
		return;
	}

	const { password, ...payload } = user.toObject();
	const isPasswordCorrect = bcrypt.compareSync(loginInput.password, password);
	if (!isPasswordCorrect) {
		res.status(400).json({ error: 'wrong password or username' });
		return;
	}

	const jwtToken = jwt.sign(payload.id, JWT_SECRET);
	res.cookie(COOKIE_NAME, jwtToken, {
		httpOnly: true,
		signed: true,
		secure: IS_PROD,
		sameSite: 'strict',
	});

	req.currentUserId = payload.id;

	const csrfToken = req.csrfToken();
	res.status(200).json({
		...payload,
		csrfToken,
	});
};

export const logout: RequestHandler = (req, res) => {
	const ws = socketConnections.get(req.signedCookies[COOKIE_NAME]?.userId);
	res.clearCookie(COOKIE_NAME);
	if (ws) ws.close();
	req.currentUserId = undefined;
	res.status(200).json({ success: 'logout successful' });
};

const updateUserUnsafe: IAsyncRequestHandler = async (req, res) => {
	const userId = req.currentUserId;
	if (!isValidObjectId(userId)) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}

	const updateInput = req.updateUserInput;
	if (updateInput?.password) {
		const salt = bcrypt.genSaltSync(10);
		updateInput.password = bcrypt.hashSync(updateInput.password, salt);
	}

	const updateUser = await userModel
		.findByIdAndUpdate(userId, updateInput, {
			new: true,
		})
		.select('-password');

	if (!updateUser) {
		res.status(400).json({ error: 'no such user' });
		return;
	}

	res.status(200).json(updateUser);
};

const deleteUserUnsafe: IAsyncRequestHandler = async (req, res) => {
	const userId = req.currentUserId;

	if (!isValidObjectId(userId)) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}

	const deletedUser = await userModel.findByIdAndRemove(userId);

	if (!deletedUser) {
		res.status(400).json({
			error: 'no user with such id',
		});
		return;
	}

	res.status(200).json({ success: 'user deleted' });
};

const getUserByIdUnsafe: IAsyncRequestHandler = async (req, res) => {
	const { value: userId, error } = documentIdValidationSchema.validate(
		req.params.userId
	);
	if (error) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}

	const user = await userModel.findById(userId).select('-password');
	if (!user) {
		res.status(400).json({ error: 'no such user' });
		return;
	}

	res.status(200).json(user);
};

const getUsersByIdsUnsafe: IAsyncRequestHandler = async (req, res) => {
	const userIds = req.userIds;
	const users = await userModel.find({ _id: { $in: userIds } });
	res.status(200).json(users);
};

const removeFriendUnsafe: IAsyncRequestHandler = async (req, res) => {
	const userId = req.currentUserId as string;
	const { value: friendId, error } = documentIdValidationSchema.validate(
		req.params.friendId
	);
	if (error) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}
	const user = await userModel.findById(userId);
	const friend = await userModel.findById(friendId);
	if (!user || !friend) {
		res.status(400).json({ error: 'user or friend not found' });
		return;
	}

	const userIdx = friend.friends.indexOf(userId);
	const friendIdx = user.friends.indexOf(friendId);
	if (friendIdx === -1) {
		res.status(400).json({ error: 'already a not friend' });
		return;
	}

	user.friends.splice(friendIdx, 1);
	friend.friends.splice(userIdx, 1);
	await Promise.all([user.save(), friend.save()]);
	res.status(200).json({ succuss: 'friend removed' });
};

const getOnlineUserUnsafe: IAsyncRequestHandler = async (req, res) => {
	const currentUser = await userModel.findById(req.currentUserId);
	if (!currentUser) {
		res.status(400).json({ error: 'auth error' });
		return;
	}
	const onlineUsers = currentUser.friends.filter((friend) =>
		socketConnections.get(friend)
	);
	res.status(200).json(onlineUsers);
};

const searchUsersByUserNameUnsafe: IAsyncRequestHandler = async (req, res) => {
	const currentUserId = req.currentUserId;
	const { error, value: username } = Joi.string()
		.min(3)
		.max(18)
		.required()
		.validate(req.params.username);
	if (error) {
		res.status(400).json({ error: 'invalid username' });
		return;
	}
	//todo use algolia or another fuzzy search method regex is expensive

	const filteringIds = (
		await friendRequestsModel.find({
			status: 'pending',
			$or: [{ recipient: currentUserId }, { requester: currentUserId }],
		})
	).reduce<string[]>(
		(prev, curr) =>
			curr.recipient === currentUserId
				? [...prev, curr.requester]
				: [...prev, curr.recipient],
		[]
	);
	filteringIds.push(currentUserId as string);

	const regex = new RegExp(username, 'gi');
	const users = await userModel.find({
		userName: regex,
		_id: { $nin: filteringIds },
	});

	res.status(200).json(users);
};

const getFriendsUnsafe: IAsyncRequestHandler = async (req, res) => {
	const currentUser = await userModel.findById(req.currentUserId);
	if (!currentUser) {
		res.status(400).json({ error: 'auth error' });
		return;
	}
	res.status(200).json(currentUser.friends);
};

const getAccountsUnsafe: IAsyncRequestHandler = async (req, res) => {
	const email = await userModel.find().select('email avatar userName');
	res.status(200).json(email);
};

export const signup = catchAsyncReqHandlerErr(signupUnsafe, signupErrorHandler);
export const login = catchAsyncReqHandlerErr(loginUnsafe);
export const updateUser = catchAsyncReqHandlerErr(updateUserUnsafe);
export const deleteUser = catchAsyncReqHandlerErr(deleteUserUnsafe);
export const getUserById = catchAsyncReqHandlerErr(getUserByIdUnsafe);
export const getUsersByIds = catchAsyncReqHandlerErr(getUsersByIdsUnsafe);

export const removeFriend = catchAsyncReqHandlerErr(removeFriendUnsafe);
export const getOnlineUser = catchAsyncReqHandlerErr(getOnlineUserUnsafe);
export const searchUsersByUserName = catchAsyncReqHandlerErr(
	searchUsersByUserNameUnsafe
);
export const getFriends = catchAsyncReqHandlerErr(getFriendsUnsafe);
export const getAccounts = catchAsyncReqHandlerErr(getAccountsUnsafe);
