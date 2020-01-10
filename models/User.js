const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 5;

const User = new Schema({
	password: { type: String, required: true },
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	id: { type: String, unique: true, required: true },
	mobile: { type: String, unique: true, required: true },
	role: { type: String, required: true, required: true},
	attendance: { type: String, default: '0' },
	daysPresent: { type: Number, default: 0 }
});

User.pre('save', function (next) {
	const user = this;

	if (!user.isModified('password')) return next();

	bcrypt.hash(user.password, SALT_WORK_FACTOR, function (err, hash) {
		console.log(hash);
		if (err) return next(err);

		user.password = hash;
		next();
	});
});

User.methods.comparePassword = function (inp_pass, cb) {
	console.log(this.password);
	bcrypt.compare(inp_pass, this.password, function (err, isMatch) {
		console.log(isMatch);
		if (err) return cb(err);
		return cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', User, 'users');