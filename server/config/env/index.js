'use strict';

var path = require('path');
var _ = require('lodash');
var fs = require('fs');

var all = {
  env: process.env.NODE_ENV,
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 9000,
  //mongodb配置
  mongo: {
    options: {
      db: {
        safe: true
      },
      server: {
        socketOptions: {
          socketTimeoutMS: 0,
          connectTimeoutMS: 0
        }
      }
    }
  },
  //redis 配置
  redis: {
    host: '127.0.0.1',
    port: 6379
  },
  //是否初始化数据
  seedDB: false,
  session:{
    secrets: 'blog-secret',
  },
  //用户角色种类
  userRoles: ['user', 'admin'],
  //七牛配置
  qiniu:{
    app_key:'YQ1W_2xsus2q5heyb3eqCakfKSi0iK8e14IA6P5F',
    app_secret:'RLiaNusSZXC4kIysUBizixK3BiCmlh2M1fIIH938',
    domain:'http://7xnzon.com1.z0.glb.clouddn.com/',
    bucket:'blog'
  },
  amap: {
    key: "5ea7155ef9ab19a99ffaaa7e880854f0"
  },

  //第三方登录配置
  github:{
    clientID:"github",
    clientSecret:"clientSecret",
    callback:"/auth/github/callback"
  },
  weibo:{
    clientID:"clientID",
    clientSecret:"clientSecret",
    callbackURL:"/auth/weibo/callback"
  },
  qq:{
    clientID:"clientID",
    clientSecret:"clientSecret",
    callbackURL:"/auth/qq/callback"
  },
  douban:{
    clientID:"clientID",
    clientSecret:"clientSecret",
    callbackURL:"/auth/qq/callback"
  },
  local:{
    admin:"254256"
  }
};

var config = _.merge(all,require('./' + process.env.NODE_ENV + '.js') || {});
//加载私有配置
if (fs.existsSync(path.join(__dirname, 'private/index.js'))) {
  config = _.merge(config, require(path.join(__dirname, 'private/index.js')) || {});
}
module.exports = config;
