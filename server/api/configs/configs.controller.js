'use strict';
// const mongoose = require('mongoose');
const qiniu = require('../../util/qiniu');
const config = require('../../config/env');

exports.getUploadToken = function *(next){
  const token = qiniu.getUptoken();
	this.status = 200;
	this.body = { uptoken: token };
};

exports.getApps = function *(next){
	if(config.apps){
		this.status = 200
		this.body = {success: true, data: config.apps}
	}else{
		this.throw(404)
	}
};
