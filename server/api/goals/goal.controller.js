'use strict';
const _ = require('lodash');
const mongoose = require('mongoose');
const Goal = mongoose.model('Goal');
const Logs = mongoose.model('Log');
const config = require('../../config/env');

exports.getGoal = function *() {
    const date = new Date(this.params.date);
    const userId = this.req.user._id;
    try{
        let goal = yield Goal.find({user: userId, from: {$lte: date}, to: {$gte: date}}).exec();
        goal = goal.map(item => {
            item = item.toObject();
            var time = item.to.getTime() - date.getTime();
            item.left = Math.floor(time/(24*60*60*1000));
            return item;
        });
        this.status = 200;
        this.body = {data: goal};
    }catch(err){
        this.throw(err);
    }
};

exports.createGoal = function *() {
    const date = new Date(this.params.date);
    const userId = this.req.user._id;
    const type = this.request.body.type;
    try{
        let goal = yield Goal.create({
            user: userId,
            from: date,
            to: getEndDay(type, date),
            type: type,
            content: this.request.body.content
        });
        if(goal != null) {
            goal = goal.toObject();
            var time = goal.to.getTime() - date.getTime();
            goal.left = Math.floor(time/(24*60*60*1000));
        }
        this.status = 200;
        this.body = {data: goal};
    }catch(err){
        this.throw(err);
    }
};

exports.updateGoal = function *() {
    const id = this.params.id;
    const userId = this.req.user._id;
    try{
        yield Goal.update({
            user: userId,
            _id: id
        }, {
            $set: {status: this.request.body.status}
        });
        this.status = 200;
        this.body = {success: true};
    }catch(err){
        this.throw(err);
    }
};

exports.deleteGoal = function *() {
    const id = this.params.id;
    const userId = this.req.user._id;
    try{
        yield Goal.remove({
            user: userId,
            _id: id
        });
        this.status = 200;
        this.body = {success: true};
    }catch(err){
        this.throw(err);
    }
};

function getEndDay(type, from) {
    type = type || '周目标';
    var to = new Date(from);
    if(type === '年目标') {
        to.setFullYear(from.getFullYear() + 1);
        to.setMonth(0);
        to.setDate(1);
    } else if(type === '月目标') {
        to.setMonth(from.getMonth() + 1);
        to.setDate(1);
    } else if(type === '周目标') {
        to.setDate(to.getDate() + 7);
    }
    return to;
}