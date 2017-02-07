'use strict';
const mongoose = require('mongoose');
const	Schema = mongoose.Schema;

let LogsSchema = new Schema({
	user_id: { type: Schema.Types.ObjectId, ref: 'User' },
	content: { type: String, trim: true },
	type: String,
	created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogsSchema);
