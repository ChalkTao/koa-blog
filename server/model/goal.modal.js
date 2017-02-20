'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GoalSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    type: String,
    from: Date,
    to: Date,
    status: { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

GoalSchema.set('toObject', { virtuals: true });
GoalSchema.index({user: 1});
module.exports = mongoose.model('Goal', GoalSchema);
