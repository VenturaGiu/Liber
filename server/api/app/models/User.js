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
},
{
  timestamps: true,
});

UserSchema.statics.partialUpdate = async function partialUpdate(id, obj) {
  const omittedAttributes = ['email', '_id'];
  const cleanObj = _.omit(obj, omittedAttributes);
  const res = await this.findByIdAndUpdate(id, cleanObj);
  return res;
};

module.exports = mongoose.model('User', UserSchema, 'users');