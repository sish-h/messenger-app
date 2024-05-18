import { IChatMsg } from '@messaging-app/shared';
import { model, Schema } from 'mongoose';

const messageSchema = new Schema<IChatMsg>({
	senderId: String,
	targetId: String,
	text: String,
	status: { type: String, default: 'sent' },
});

export default model('message', messageSchema);
