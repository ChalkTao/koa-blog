'use strict';
const _ = require('lodash');
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const Logs = mongoose.model('Log');
const config = require('../../config/env');
const userField = 'nickname avatar occupation gender college birthPlace'

exports.createArticle = function *() {
    let article = new Article();
    article.user = this.req.user._id;
    this.status = 200;
	this.body = {data: article};
};

exports.getArticle = function *() {
  const id = this.params.id;
	try{
		let article = yield Article.findOne({_id: id}).populate('user', userField).exec();
        article = article.toObject();
		this.status = 200;
		this.body = {data: article};
	}catch(err){
		this.throw(err);
	}
};

exports.updateArticle = function *() {
    const id = this.params.id;
    let data = _.pick(this.request.body, ['title', 'content', 'category', 'publish', 'labels']);
    data.user = this.req.user._id;
    data.updated = new Date();
	try{
		const article = yield Article.findByIdAndUpdate({_id: id}, {$set: data}, {upsert: true, new: false, setDefaultsOnInsert: true});
		this.status = 200;
		this.body = {success: true};
	}catch(err){
		this.throw(err);
	}
};

exports.updateArticleStatus = function *() {
    const id = this.params.id;
    if(this.request.body._id){
	  delete this.request.body._id;
	}
	try{
		const article = yield Article.findByIdAndUpdate({_id: id, user: this.req.user._id}, {$set: {status: this.request.body.status}});
		this.status = 200;
		this.body = {data: article};
	}catch(err){
		this.throw(err);
	}
};

exports.deleteArticle = function *() {
    const id = this.params.id;
	try{
		const result = yield Article.findByIdAndRemove({_id: id, user: this.req.user._id});
		this.status = 200;
        this.body = {success: true};
	}catch(err){
		this.throw(err);
	}
};

exports.getUserArticle = function *() {
    const userId = this.params.uid;
    let options = {
        user: userId
    };
    if(this.query.category) {
        options.category = this.query.category;
    }
    if(this.query.label) {
        options.labels = {'$elemMatch': {'$eq': this.query.label}}
    }
    if(this.query.publish) {
        options.publish = this.query.publish;
    }
    if(this.query.title) {
        options['$text'] = {'$search': this.query.title};
    }
    let limit = Math.min(this.query.limit || 20, 50);
    let page = this.query.page-1 || 0;
    let offset = page * limit;
    console.log(options);
    try{
        let articleList = yield Article.find(options)
            .populate('user', userField).sort({created: -1}).limit(limit).skip(offset).exec();
        let count = yield Article.count(options).exec();
        this.status = 200;
        this.body = {data: articleList, count: count, limit: limit};
	}catch(err){
		this.throw(err);
	}
};

exports.getCategory = function *() {
    const userId = this.params.uid;
    try{
        let category = yield Article.aggregate(
            {$match: {user: new mongoose.Types.ObjectId(userId)}},
            {$group: { _id: {category: "$category"}, labels: {$push: "$labels"}, count: { $sum: 1 }}}
        ).exec();
        category.forEach(item => {
            item.category = item._id.category;
            delete item._id;
            item.labels = Array.from(new Set(_.flatten(item.labels)));
        });
        this.status = 200;
        this.body = {data: category};
    }catch(err){
        this.throw(err);
    }
};
