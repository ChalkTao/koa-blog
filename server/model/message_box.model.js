'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MessageBoxSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  target: { type: Schema.Types.ObjectId, ref: 'User' },
  unread_count: {type: Number, default: 0},
  messages: [{
    from_user: { type: Schema.Types.ObjectId, ref: 'User' },
    to_user: { type: Schema.Types.ObjectId, ref: 'User' },
  	content: { type: String},
  	created: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],
  updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MessageBox', MessageBoxSchema);
