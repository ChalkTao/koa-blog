'use strict';

// 设置默认环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const path = require('path');
const fs = require('fs');
const app = require('koa')();
const mongoose = require('mongoose');
const config = require('./config/env');
const loggerMiddle = require('./util/logs');
const errorHandleMiddle = require('./util/error');

// 连接数据库.
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.Promise = require('bluebird');
const modelsPath = path.join(__dirname, 'model');
fs.readdirSync(modelsPath).forEach(function (file) {
	if (/(.*)\.(js$|coffee$)/.test(file)) {
		require(modelsPath + '/' + file);
	}
});

// log记录
app.use(loggerMiddle());
// 错误处理中间件
app.use(errorHandleMiddle());
require('./config/koa')(app);
require('./routes')(app);
// 错误监听
app.on('error',(err,ctx)=>{
  console.log(err.stack);
	if (process.env.NODE_ENV != 'test') {
		console.error('error', err);
	}
});
// Start server
app.listen(config.port, function () {
  console.log('Koa server listening on %d, in %s mode', config.port, app.env);
});

module.exports = app;
