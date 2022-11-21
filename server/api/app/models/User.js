const mongoose = require('mongoose');
const crypto = require('crypto');
const _ = require('underscore');

const { Schema } = mongoose;

const UserSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    set: value => crypto.createHash('md5').update(value).digest('hex'),
  },
  verified: {
    type: Boolean,
    default: false,
  },
  activated: {
    type: Boolean,
    default: true,
  },
  account_type: {
    type: String,
    default: 'standard',
    lowercase: true,
  },
  genres: [{
    type: Schema.Types.ObjectId,
    ref: 'Genre',
  }],
  address: [{
    type: Schema.Types.ObjectId,
    ref: 'Address',
  }],
  cards: [{
    type: Schema.Types.ObjectId,
    ref: 'Card',
  }],
},
{
  timestamps: true,
});

module.exports = mongoose.model('User', UserSchema, 'users');