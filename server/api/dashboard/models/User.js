const mongoose = require('mongoose');
const crypto = require('crypto');
const _ = require('underscore');

const { Schema } = mongoose;

const Dash_userSchema = Schema({
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
  }
},
{
  timestamps: true,
});

Dash_userSchema.statics.partialUpdate = async function partialUpdate(email, obj) {
  const omittedAttributes = ['email', '_id', 'verified', 'account_type', 'activated'];
  const cleanObj = _.omit(obj, omittedAttributes);
  const res = await this.findOneAndUpdate(email, cleanObj);
  return res;
};

module.exports = mongoose.model('dash_user', Dash_userSchema);