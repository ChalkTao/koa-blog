'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  content: String,
  category: String,
  labels: [String],

  status: { type: Number, default: 0 },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

PostSchema.set('toObject', { virtuals: true });
PostSchema.index({category: 1});
module.exports = mongoose.model('Post', PostSchema);
