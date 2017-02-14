'use strict';

var Router = require("koa-router")();
var users = require('./api/users');
var articles = require('./api/articles');
var collections = require('./api/collections');
var configs = require('./api/configs');
var auth = require('./auth');

module.exports = function(app) {
    Router.use('/user', users.routes(), users.allowedMethods());
    Router.use('/article', articles.routes(), articles.allowedMethods());
    Router.use('/collection', collections.routes(), collections.allowedMethods());
    Router.use('/auth', auth.routes(), auth.allowedMethods());
    Router.use('/config', configs.routes(), configs.allowedMethods());
	Router.get("/*", function *() {
	  this.body = {status:'success',data:'Not Found'};
	});
	app.use(Router.routes());
};
