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
  authors: [{
    type: String,
    required: true,
  }],
  synopsis:{
    type: String,
  },
  publisher:{
    type: String
  },
  year: {
    type: Number
  },
  page_count: {
    type: Number
  },
  location: {
    type: String
  },
  language: {
    type: String
  },
  genre: [{
    type: Schema.Types.ObjectId,
    ref: 'Genre',
  }],
  key_words: [{
    type: String
  }]
},
{
  timestamps: true,
});

module.exports = mongoose.model('Book', BookSchema, 'books');