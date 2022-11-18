const mongoose = require('mongoose');
const crypto = require('crypto');
const _ = require('underscore');

const { Schema } = mongoose;

const BookSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
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
  location: {
    type: String
  },
  language: {
    type: String
  },
  page_count: {
    type: Number
  },
  dimensions: {
    height: {
      type: String
    },
    width:{
      type: String
    }
  },
  genre: [{
    type: Schema.Types.ObjectId,
    ref: 'Genre',
  }],
  key_words: [{
    type: String
  }],
  path_img: {
    type: String
  }
},
{
  timestamps: true,
});

module.exports = mongoose.model('Book', BookSchema, 'books');