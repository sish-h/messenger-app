import { IUser } from '@messaging-app/shared';
import bcrypt from 'bcryptjs';
import { model, Schema } from 'mongoose';

const userSchema = new Schema<IUser>({
	avatar: String,
	userName: String,
	email: { unique: true, type: String },
	password: String,
	friends: [String],
});

userSchema.pre('save', function (next) {
	if (!this.isModified('password')) return next();
	const salt = bcrypt.genSaltSync(10);
	this.password = bcrypt.hashSync(this.password, salt);
	next();
});

export default model('user', userSchema);
