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
    app_key:'ikik9rVYFdu9DoF3_M83CS1qlWCO3Mou6N0GqGNd',
    app_secret:'DHqROc5aIwhxHqGUamhfU3iSQKApBTrKmuGjax0a',
    domain:'http://obonyegj8.bkt.clouddn.com/',
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
  },
  //移动APP列表
  apps:[
    {
      name:'React Native',
      gitUrl:'http://github.com/jackhutu/jackblog-react-native-redux',
      downloadUrl:{
        android:'http://a.app.qq.com/o/simple.jsp?pkgname=top.jackhu.reactnative',
        ios:''
      },
      qrcode:'http://upload.jackhu.top/qrcode/jackblog-react-native-qrcode.png'
    }
  ]
};

var config = _.merge(all,require('./' + process.env.NODE_ENV + '.js') || {});
//加载私有配置
if (fs.existsSync(path.join(__dirname, 'private/index.js'))) {
  config = _.merge(config, require(path.join(__dirname, 'private/index.js')) || {});
}
module.exports = config;
