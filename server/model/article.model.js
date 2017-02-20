'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ArticleSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  content: String,
  category: String,
  labels: [String],

  publish: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

ArticleSchema.set('toObject', { virtuals: true });
ArticleSchema.index({title: "text"});
module.exports = mongoose.model('Article', ArticleSchema);
