'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CollectionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
	room: { type: Schema.Types.ObjectId, ref: 'Room' },
    status: { type: Number, default: 0 },
    note: String,
	created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Collection', CollectionSchema);
