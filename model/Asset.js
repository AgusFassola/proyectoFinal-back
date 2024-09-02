const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assetSchema = new Schema({
    description:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    assigned_employee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    assigned_date:{
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Asset', assetSchema );