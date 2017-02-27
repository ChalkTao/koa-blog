'use strict';

const mongoose = require('mongoose');
const router = require("koa-router")();
const passport = require('koa-passport');
const User = mongoose.model('User');
const auth = require('../auth.service');
const config = require('../../config/env');

function checkAdminPassword() {
    return function *(next) {
        //测试环境不用验证码
        if (process.env.NODE_ENV !== 'test') {
            if (!this.request.body.admin) {
                this.throw('管理员密码不能为空', 422);
            } else if (config.local.admin !== this.request.body.admin) {
                this.throw('管理员密码错误', 422);
            }
        }
        yield next;
    }
}

router.post('/login', function*(next) {
    var ctx = this;
    yield passport.authenticate('local', function*(err, user, info) {
        if (err) ctx.throw(err);
        if (info) {
            ctx.status = 403;
            return ctx.body = info;
        }
        const token = auth.signToken(user._id);
        ctx.body = {registered: user.status !== 0, token: token, user: user.userInfo};
    }).call(this, next)
});

router.post('/register', checkAdminPassword(), function*(next) {
    try {
        if (this.request.body.nickname === 'admin') {
            this.throw('用户名非法', 422)
        }
        let origin_user = yield User.findOne({email: this.request.body.email});
        if (origin_user) {
            this.throw('用户已存在!', 422);
        }
        origin_user = yield User.findOne({nickname: this.request.body.nickname});
        if (origin_user) {
            this.throw('用户昵称已被注册!', 422);
        }
        const user = yield User.create(this.request.body);
        const token = auth.signToken(user._id);
        this.status = 200;
        this.body = {token: token, user: user.userInfo};
    } catch (err) {
        this.throw(err);
    }
});

router.put('/:uid', function *() {
    const uid = this.params.uid;
    try {
        const user = yield User.findOneAndUpdate({_id: uid}, {
            $set: {
                nickname: this.request.body.nickname,
                avatar: this.request.body.avatar,
                gender: this.request.body.gender,
                occupation: this.request.body.occupation,
                college: this.request.body.college,
                birthPlace: this.request.body.birthPlace,
                status: 1,
                updated: new Date()
            }
        });
        const token = auth.signToken(user._id);
        this.status = 200;
        this.body = {token: token};
    } catch (err) {
        this.throw(err);
    }
});

module.exports = router;
