'use strict';
const _ = require('lodash');
const mongoose = require('mongoose');
const Task = mongoose.model('Task');
const Schedule = mongoose.model('Schedule');
const Logs = mongoose.model('Log');
const config = require('../../config/env');
const utils = require('../../util/tools');

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
        if(!tasks.scheduled) {
            var schedule = yield getSchedule(date, userId);
            var new_task = _.concat(schedule, tasks.tasks);
            tasks.tasks = new_task;
            if(getDay(date) < 0) {
                yield Task.update({user: userId, date: date}, {$set: {
                    tasks: new_task,
                    scheduled: true
                }})
            }
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
        var tasks = this.request.body.tasks;
        if(getDay(date) >= 0 && this.request.body.tasks) {
            tasks = this.request.body.tasks.filter(item => {
                return item.category !== '日常';
            });
        }
        console.log(tasks);
        let res = yield Task.findOneAndUpdate({user: userId, date: date}, {
            $set : {
                tasks: tasks,
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

exports.createSchedule = function *() {
    const date = new Date(this.params.date);
    const userId = this.req.user._id;
    const type = this.request.body.type;
    try{
        let schedule = yield Schedule.create({
            user: userId,
            from: date,
            to: new Date("2099-12-31"),
            type: type,
            content: this.request.body.content
        });
        if(schedule != null) {
            schedule = schedule.toObject();
            schedule.status = getValidity(schedule.type, date);
        }
        this.status = 200;
        this.body = {data: schedule};
    }catch(err){
        this.throw(err);
    }
};

exports.getSchedule = function *() {
    const date = new Date(this.params.date);
    const userId = this.req.user._id;
    try{
        let schedule = yield Schedule.find({user: userId, from: {$lte: date}, to: {$gte: date}}).exec();
        schedule = schedule.map(item => {
            item = item.toObject();
            item.status = getValidity(item.type, date);
            return item;
        });
        schedule.sort(schedule_sort);
        this.status = 200;
        this.body = {data: schedule};
    }catch(err){
        this.throw(err);
    }
};

exports.updateSchedule = function *() {
    const id = this.params.id;
    const userId = this.req.user._id;
    const date = new Date();
    try{
        let schedule = yield Schedule.findOne({user: userId, _id: id}).exec();
        if(schedule != null && schedule.from !== null) {
            var time = date.getTime() - schedule.from.getTime();
            var day = Math.floor(time/(24*60*60*1000));
            if(day < 1) {
                yield Schedule.remove({user: userId, _id: id});
            } else if(schedule.to > date) {
                yield Schedule.update({user: userId, _id: id}, {$set: {to: new Date()}});
            }
            //TODO: updateTask
        }
        this.status = 200;
        this.body = {success: true};
    }catch(err){
        this.throw(err);
    }
};

exports.getCalendar = function *() {
    const userId = this.req.user._id;
    try{
        let res = yield Task.find({user: userId, date: {
            $gte: this.query.start,
            $lte: this.query.end
        }}).exec();
        let tasks = res.filter(item => {
            return item.tasks.length > 0 || item.finished.length>0;
        }).map(item => {
            var total = item.tasks.length + item.finished.length;
            var remain = item.tasks.length;
            var label = 'fail';
            if(remain / total <= 0.2) {
                label = 'success';
            }
            return {
                title: '任务: ' + item.tasks.length + '/' + total,
                start: item.date,
                end: item.date,
                cssClass: ['task', label]
            }
        });
        let scores = res.filter(item => {
            return item.scores.length > 0
        }).map(item => {
            var score = item.scores.reduce((c, i) => {return i.score + c;}, 0);
            var label = score > 0 ? 'success' : 'fail';
            return {
                title: '评分: ' + score,
                start: item.date,
                end: item.date,
                cssClass: ['score', label]
            }
        });
        let states = res.filter(item => {
            return item.state && item.state.length > 0;
        }).map(item => {
            return {
                title: '日记',
                start: item.date,
                end: item.date,
                cssClass: 'state'
            }
        });
        let important = res.filter(item => {
            return item.tasks.length > 0;
        }).reduce((origin, item)=> {
            var temp = item.tasks.filter(i => {
                return i.category === '重要';
            }).map(i => {
                console.log(i);
                return {
                    title: i.content,
                    start: item.date,
                    end: item.date,
                    cssClass: ['task', 'important']
                }
            });
            return _.concat(origin, temp);
        }, []);
        let events = _.concat(important, states, scores, tasks);
        console.log(events);
        this.status = 200;
        this.body = {data: events};
    }catch(err){
        this.throw(err);
    }
};

exports.getChartData = function *() {
    const userId = this.req.user._id;
    try{
        let res = yield Task.find({user: userId, date: {
            $gte: this.query.start,
            $lte: this.query.end
        }}).exec();
        let undo = 0; let done = 0;
        res.filter(item => {
            return item.tasks.length > 0 || item.finished.length>0;
        }).forEach(item => {
            undo += item.tasks.length;
            done += item.finished.length;
        });
        let taskDonut = [{label: '未完成', value: undo}, {label: '已完成', value: done}];
        let taskLine = res.map(item => {
            return {
                date: item.date,
                finish: item.finished.length,
                task: item.tasks.length
            }
        });

        let plus = 0; let minus = 0;
        res.filter(item => {
            return item.scores.length > 0
        }).forEach(item => {
            item.scores.forEach(i => {
                if(i.score > 0) {plus += i.score;} else {minus += -i.score;}
            })
        });
        let scoreDonut = [{label: '减分', value: minus}, {label: '加分', value: plus}];
        let scoreLine = res.map(item => {
            var score = item.scores.reduce((c, i) => {return i.score + c;}, 0);
            return {
                date: item.date,
                score: score
            }
        });
        console.log(scoreLine)

        this.status = 200;
        this.body = {
            taskDonut: taskDonut,
            taskLine: taskLine,
            scoreDonut: scoreDonut,
            scoreLine: scoreLine
        };
    }catch(err){
        this.throw(err);
    }
};

function getValidity(type, date) {
    if(type === '每天') {
        return true
    } else if(type === '工作日') {
        return date.getDay() >=1 && date.getDay() <= 5
    } else if(type === '周末') {
        return date.getDay() ==0 || date.getDay() == 6
    }
}

function schedule_sort(o1, o2) {
    const schedule_list = ['每天', '工作日', '周末'];
    return o2.status - o1.status || schedule_list.indexOf(o2.type) - schedule_list.indexOf(o1.type);
}

function getDay(date) {
    var time = new Date(date).getTime() - new Date().getTime();
    var day = Math.floor(time/(24*60*60*1000));
    console.log(day);
    return day;
}

function * getSchedule(date, userId) {
    const today = new Date(date);
    let schedule = yield Schedule.find({user: userId, from: {$lte: today}, to: {$gte: today}}).sort({created: -1}).exec();
    schedule = schedule.filter(item => {
        var valid = getValidity(item.type, today);
        return valid;
    });
    // schedule.sort(schedule_sort);
    schedule = schedule.map(item => {
        return {
            content: item.content,
            category: '日常'
        }
    });
    return schedule;
}