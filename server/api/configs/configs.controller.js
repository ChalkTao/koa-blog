'use strict';

const qiniu = require('../../util/qiniu');
const config = require('../../config/env');

exports.getUploadToken = function *(next){
  const token = qiniu.getUptoken();
	this.status = 200;
	this.body = { uptoken: token };
};

exports.getImageDomain = function *(next){
	this.status = 200;
	this.body = { domain: config.qiniu.domain };
};