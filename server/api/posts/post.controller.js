'use strict';
const _ = require('lodash');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const Collection = mongoose.model('Collection');
const Logs = mongoose.model('Log');
const config = require('../../config/env');
const userField = 'nickname avatar occupation gender college birthPlace'

exports.createRoom = function *() {
    let room = new Room();
  room.user = this.req.user._id
  this.status = 200;
	this.body = {data: room};
}

exports.getRoom = function *() {
  const id = this.params.id;
	try{
		let room = yield Room.findOne({_id: id}).populate('user', userField).exec();
    room = room.toObject();
    if(this.req.user) {
      const star = yield Collection.findOne({room: id, user: this.req.user._id}).exec();
      room.isStar = !!star;
    }
		this.status = 200;
		this.body = {data: room};
	}catch(err){
		this.throw(err);
	}
}

exports.updateRoom = function *() {
  const id = this.params.id;
  let data = _.pick(this.request.body, ['title', 'address', 'user', 'gender', 'rent', 'photos', 'description', 'available_date', 'contact_type', 'contact_account', 'poi_id', 'poi_name', 'poi_address', 'poi_location']);
  data.updated = new Date();
  data.gender = data.gender || "u";
  data.available_gender = data.gender==="u"? ["f", "m"] : [data.gender]
	try{
		const room = yield Room.findByIdAndUpdate({_id: id}, {$set: data}, {upsert: true, new: false, setDefaultsOnInsert: true});
		this.status = 200;
		this.body = {success: true};
	}catch(err){
		this.throw(err);
	}
}

exports.updateRoomStatus = function *() {
  const id = this.params.id;
  if(this.request.body._id){
	  delete this.request.body._id;
	}
	try{
		const room = yield Room.findByIdAndUpdate({_id: id, user: this.req.user._id}, {$set: {status: this.request.body.status}});
		this.status = 200;
		this.body = {data: room};
	}catch(err){
		this.throw(err);
	}
}

exports.deleteRoom = function *() {
  const id = this.params.id;
	try{
		const result = yield Room.findByIdAndRemove({_id: id, user: this.req.user._id});
		this.status = 200;
        this.body = {success: true};
	}catch(err){
		this.throw(err);
	}
}

exports.getMyRoom = function *() {
  try{
		const roomList = yield Room.find({user: this.req.user._id}).limit(20).exec();
		this.status = 200;
		this.body = {data: roomList};
	}catch(err){
		this.throw(err);
	}
}

exports.getUserRoom = function *() {
  const userId = this.params.id;
  try{
		let roomList = yield Room.find({user: userId}).populate('user', userField).limit(20).exec();
    if(this.req.user) {
      const stars = yield Collection.find({user: this.req.user._id}).exec();
      const roomIds = stars.map(item => {
        return String(item.room);
      });
      roomList = roomList.map(item => {
        let result = item.toObject();
        result.isStar = (roomIds.indexOf(String(item._id)) !== -1);
        return result;
      });
    }
		this.status = 200;
		this.body = {data: roomList};
	}catch(err){
		this.throw(err);
	}
}

exports.getRoomList = function *() {
  let options = {
    status: 0,
  }
  if(this.query.line) {
    options.traffic_line = this.query.line;
  }
  if(this.query.available_date) {
    options.available_date = {$lte: this.query.available_date}
  }
  let rent = {}
  if(this.query.min_price) {
    rent["$gte"] = Number(this.query.min_price)
  }
  if(this.query.max_price) {
    rent["$lte"] = Number(this.query.max_price)
  }
  if(!_.isEmpty(rent)) {
    options.rent = rent
  }
  if(this.query.gender && this.query.gender !== "u") {
    options.available_gender = this.query.gender
  }
  if(this.query.location) {
    let location = JSON.parse(this.query.location);
    options.poi_location = { $near:{ $geometry:{ type: "Point" , coordinates: location }, $maxDistance: 500}}
  }
  console.log(options)
  let limit = Math.min(this.query.limit || 20, 50)
  try{
		let roomList = yield Room.find(options).populate('user', userField).limit(limit).exec();
    if(this.req.user) {
      const stars = yield Collection.find({user: this.req.user._id}).exec();
      const roomIds = stars.map(item => {
        return String(item.room);
      });
      roomList = roomList.map(item => {
        let result = item.toObject();
        result.isStar = (roomIds.indexOf(String(item._id)) !== -1);
        return result;
      });
    }
		this.status = 200;
		this.body = {data: roomList};
	}catch(err){
		this.throw(err);
	}
}
