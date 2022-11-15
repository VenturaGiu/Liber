const mongoose = require('mongoose');
const crypto = require('crypto');
const _ = require('underscore');

const { Schema } = mongoose;

const AddressSchema = new Schema({
  name:{
    type: String,
  },
  cep: {
    type: String
  },
  road: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  number:{
    type: String
  },
  complement: {
    type: String
  },
  main: {
    type: Boolean,
    default: false,
  }
},
{
    timestamps: true,
});

module.exports = mongoose.model('Address', AddressSchema, 'address');