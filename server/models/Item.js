const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: [true, 'Please add an item name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    type: {
        type: String,
        enum: ['Lost', 'Found'],
        required: [true, 'Please specify type (Lost/Found)']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    contactInfo: {
        type: String,
        required: [true, 'Please add contact information']
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
