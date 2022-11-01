const mongoose = require('mongoose');
const _ = require('underscore');

const { Schema } = mongoose;

const GenreSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('Genre', GenreSchema, 'genres');