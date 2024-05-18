import { IFriendRequest } from '@messaging-app/shared';
import { model, Schema } from 'mongoose';

const friendRequestModel = new Schema<IFriendRequest>({
	recipient: String,
	requester: String,
	status: {
		type: String,
		default: 'pending',
	},
});

export default model('friendRequest', friendRequestModel);
