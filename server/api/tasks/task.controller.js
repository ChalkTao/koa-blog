'use strict';
const _ = require('lodash');
const mongoose = require('mongoose');
const Task = mongoose.model('Task');
const Logs = mongoose.model('Log');
const config = require('../../config/env');

exports.getDailyTask = function *() {
    const date = this.params.date;
    const userId = this.req.user._id;
    try{
        let tasks = yield Task.findOne({user: userId, date: date}).exec();
        if(tasks != null) {
            tasks = tasks.toObject();
        } else {
            tasks = yield Task.create({user: userId, date: date});
        }
        this.status = 200;
        this.body = {data: tasks};
    }catch(err){
        this.throw(err);
    }
};

exports.updateDailyTask = function *() {
    const date = this.params.date;
    const userId = this.req.user._id;
    try{
        let tasks = yield Task.findOneAndUpdate({user: userId, date: date}, {
            $set : {
                tasks: this.request.body.tasks,
                finished: this.request.body.finished,
                updated: new Date()
            }
        }).exec();
        this.status = 200;
        this.body = {success: true};
    }catch(err){
        this.throw(err);
    }
};

exports.updateDailyScore = function *() {
    const date = this.params.date;
    const userId = this.req.user._id;
    try{
        let tasks = yield Task.findOneAndUpdate({user: userId, date: date}, {
            $set : {
                scores: this.request.body.scores
            }
        }).exec();
        this.status = 200;
        this.body = {success: true};
    }catch(err){
        this.throw(err);
    }
};

exports.updateDailyState = function *() {
    const date = this.params.date;
    const userId = this.req.user._id;
    console.log(this.request.body)
    try{
        let tasks = yield Task.findOneAndUpdate({user: userId, date: date}, {
            $set : {
                state: this.request.body.state
            }
        }).exec();
        this.status = 200;
        this.body = {success: true};
    }catch(err){
        this.throw(err);
    }
};