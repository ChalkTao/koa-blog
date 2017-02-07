'use strict';
const mongoose = require('mongoose');
const Collection = mongoose.model('Collection');
const Log = mongoose.model('Log');
const config = require('../../config/env');

exports.addToCollection = function *() {
  const rid = this.params.rid;
  const user = this.req.user;
  try{
    yield Collection.findOneAndUpdate({room: rid, user: user._id}, {}, {upsert: true, setDefaultsOnInsert: true});
		this.status = 200;
		this.body = {success: true};
	}catch(err){
		this.throw(err);
	}
}

exports.removeFromCollection = function *() {
  const rid = this.params.rid;
  const user = this.req.user;
  try{
    yield Collection.findOneAndRemove({room: rid, user: user._id});
		this.status = 200;
		this.body = {success: true};
	}catch(err){
		this.throw(err);
	}
}

exports.getCollection = function *() {
  try{
    const collectionList = yield Collection.find({user: this.req.user._id}).populate('room').sort({'updated': -1}).limit(50).exec();
    this.status = 200;
    this.body = {data: collectionList};
  }catch(err){
    this.throw(err);
  }
}

exports.updateCollection = function *() {
  const rid = this.params.rid;
  const user = this.req.user;
  try{
    yield Collection.findOneAndUpdate({room: rid, user: user._id}, {$set: {note: this.request.body.note, updated: new Date()}});
    this.status = 200;
    this.body = {success: true};
  }catch(err){
    this.throw(err);
  }
}
