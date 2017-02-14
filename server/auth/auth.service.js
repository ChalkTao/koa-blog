'use strict';
const mongoose = require('mongoose');
const passport = require('koa-passport');
const config = require('../config/env');
const jwt = require('koa-jwt');
const compose = require('koa-compose');
const User = mongoose.model('User');

function authToken() {
  return compose([
    function *(next) {
      if(this.query && this.query.access_token){
          this.headers.authorization = 'Bearer ' + this.query.access_token;
      }
      yield next;
    },
    jwt({ secret: config.session.secrets, passthrough: true })
  ])
}

function isAuthenticated() {
  return compose([
      authToken(),
      function *(next) {
        if(!this.state.user) this.throw('请登录', 401);
        yield next;
      },
      function *(next) {
        var user = yield User.findById(this.state.user._id);
        if (!user) this.throw('请登录', 401);
        this.req.user = user;
        yield next;
      }
    ])
}

function mayAuthenticated() {
  return compose([
      authToken(),
      function *(next) {
        if(!this.state.user) {
          yield next;
        } else {
          const user = yield User.findById(this.state.user._id);
          if (user) {
            this.req.user = user;
          }
          yield next;
        }
      }
    ])
}

function hasRole(roleRequired) {
  if (!roleRequired) this.throw('Required role needs to be set');
  return compose([
      isAuthenticated(),
      function *(next) {
        if (config.userRoles.indexOf(this.req.user.role) >= config.userRoles.indexOf(roleRequired)) {
          yield next;
        }else {
          this.throw(403);
        }
      }
    ])
}

function signToken(id) {
  return jwt.sign({ _id: id }, config.session.secrets, { expiresIn: '1y' });
}

/**
 * sns登录传递参数
 */
function snsPassport() {
  return compose([
      authToken(),
      function *(next) {
        this.session.passport = {
          redirectUrl: this.query.redirectUrl || '/'
        };
        if(this.state.user){
          this.session.passport.userId = this.state.user._id
        }
        yield next;
      }
    ])
}

exports.isAuthenticated = isAuthenticated;
exports.mayAuthenticated = mayAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.snsPassport = snsPassport;
