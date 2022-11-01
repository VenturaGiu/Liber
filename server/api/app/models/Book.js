const mongoose = require('mongoose');
const crypto = require('crypto');
const _ = require('underscore');

const { Schema } = mongoose;

const BookSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  synopsis:{
    type: String,
  },
  company:{
    type: String
  },
  year: {
    type: Number
  },
  genre: [{
    type: Schema.Types.ObjectId,
    ref: 'Genre',
  }],
},
{
  timestamps: true,
});

module.exports = mongoose.model('Book', BookSchema, 'books');