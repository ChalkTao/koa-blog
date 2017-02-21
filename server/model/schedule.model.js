'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ScheduleSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    type: String,
    from: Date,
    to: Date,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

ScheduleSchema.set('toObject', { virtuals: true });
ScheduleSchema.index({user: 1});
module.exports = mongoose.model('Schedule', ScheduleSchema);
