'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const picSchema = Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  userID: { type: Schema.Types.ObjectId, required: true },
  galleryID: { type: Schema.Types.ObjectId, required: true },
  imgageURI: { type: String, required: true, unique: true },
  objectKey: { type: String, required: true, unique: true },
  timeStamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('pic', picSchema);