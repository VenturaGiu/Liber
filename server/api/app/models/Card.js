const mongoose = require('mongoose');
const crypto = require('crypto');
const _ = require('underscore');

const { Schema } = mongoose;

const CardSchema = new Schema({
  number:{
    type: String,
  },
  expiration_date: {
    type: String
  },
  cvv: {
    type: String
  },
  cardholder: {
    type: String
  },
  cpf: {
    type: String
  },
  name_card:{
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

module.exports = mongoose.model('Card', CardSchema, 'cards');