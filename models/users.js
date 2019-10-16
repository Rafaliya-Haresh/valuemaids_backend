'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var userSchema = new Schema({
    firstname: String,
    lastnamew: String,
	email: String,
	password: String,
	salt: {
		type: String
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	provider: {
		type: String,
		default: "Local"
	}
});


// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);