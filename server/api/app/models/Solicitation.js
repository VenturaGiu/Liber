const mongoose = require('mongoose');
const _ = require('underscore');

const { Schema } = mongoose;

const SolicitationSchema = Schema({
    id_user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    id_ad: {
        type: Schema.Types.ObjectId,
        ref: 'Ad',
    },
    id_user_solicitation: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    id_ad_solicitation: {
        type: Schema.Types.ObjectId,
        ref: 'Ad',
    },
    status: {
        type: String,
        default: 'analisando'
    }
},
{
    timestamps: true,
});

module.exports = mongoose.model('Solicitation', SolicitationSchema, 'solicitations');