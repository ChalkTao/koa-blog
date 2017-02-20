'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TaskSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    date: String,
    tasks: [{
        content: String,
        category: String
    }],
    finished: [{
        content: String,
        category: String,
        finishTime: Date
    }],
    scores: [{
        content: String,
        score: Number
    }],
    state: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

TaskSchema.set('toObject', { virtuals: true });
TaskSchema.index({user: 1, date: 1});
module.exports = mongoose.model('Task', TaskSchema);
