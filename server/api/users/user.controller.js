'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Logs = mongoose.model('Log');
const MessageBox = mongoose.model('MessageBox');
const ccap = require('ccap')();
const config = require('../../config/env');

exports.getCaptcha = function *() {
	const ary = ccap.get();
	const txt = ary[0];
	const buf = ary[1];
	this.session.captcha = txt;
	this.status = 200;
	this.body = buf;
};

exports.getMe = function *() {
  const user = this.req.user;
	try{
    if(!user) this.throw('UserNotFound',404);
    let unreadComment = yield CommentBox.count({user_id: this.req.user._id, read: false}).exec();
    let unreadMessage = yield MessageBox.findOne({user_id: this.req.user._id}).exec();
    let starRoomNumber = yield Collection.count({user: this.req.user._id}).exec();
		this.status = 200;
		this.body = {
      user: user.userInfo,
      unreadComment: unreadComment,
      unreadMessage: unreadMessage.unread_count,
      starRoomNumber: starRoomNumber
    };
	}catch(err){
		this.throw(err);
	}
};

exports.getUser = function *() {
	const userId = this.params._id;
	try{
		const user = yield User.findById(userId);
    if(!user) this.throw('UserNotFound',404);
		this.status = 200;
		this.body = user.userInfo;
	}catch(err){
		this.throw(err);
	}
};

exports.updateUser = function *() {
  const user = this.req.user;
  try{
    const userInfo = yield User.findOneAndUpdate({_id: user._id}, {$set: this.request.body}, {new: true})
    this.status = 200;
    this.body = user.userInfo;
  }catch(err){
    this.throw(err);
  }
};
