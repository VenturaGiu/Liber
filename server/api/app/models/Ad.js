const mongoose = require('mongoose');
const _ = require('underscore');

const { Schema } = mongoose;

const AdSchema = Schema({
  id_user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  id_book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
  },
  price: {
    type: String
  },
  type_ad: [{
    type: String
  }],
  type_buy:{
    type: String
  },
  id_user_buy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
  }
},
{
  timestamps: true,
});

module.exports = mongoose.model('Ad', AdSchema, 'ads');