'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

let UserSchema = new Schema({
	nickname:String,
    avatar:String,
    email:String,
    hashedPassword: String,
    salt: String,
	sns_account: {
        provider: String,
        openId: String,
        unionId: String,
        accessToken: String
    },

    gender: String,
    occupation: String,
    college: String,
    birthPlace: String,
    description: String,

    status: {type: Number, default: 0},   //0 unrigestered, 1 normal, 2 forbidden
	role: { type : String, default: 'user' },
	created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

UserSchema
  .virtual('userInfo')
  .get(function() {
    return {
      '_id': this._id,
      'nickname': this.nickname,
      'avatar': this.avatar,
      'status': this.status,
      'role': this.role,
      'gender': this.gender,
      'occupation': this.occupation,
      'college': this.college,
      'birthPlace': this.birthPlace,
      'company': this.company,
      'description': this.description
    };
  });

UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

UserSchema
	.path('nickname')
	.validate(function(value, respond) {
		var self = this;
		this.constructor.findOne({nickname: value}, function(err, user) {
			if(err) throw err;
			if(user) {
				if(self.id === user.id) return respond(true);
				return respond(false);
			}
			respond(true);
		});
	}, '这个呢称已经被使用.');

UserSchema.methods = {
	//检查用户权限
	hasRole: function(role) {
		var selfRoles = this.role;
		return (selfRoles.indexOf('admin') !== -1 || selfRoles.indexOf(role) !== -1);
	},
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },
    //生成盐
    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },
    //生成密码
    encryptPassword: function(password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
    }
};

UserSchema.set('toObject', { virtuals: true });
UserSchema.index({email: 1}, {unique: true});
module.exports = mongoose.model('User', UserSchema);
