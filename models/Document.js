const { Schema, default: mongoose } = require('mongoose');

const DocumentSchema = new Schema({
    _id: String,
    data: Object
})

module.exports = mongoose.model('Document', DocumentSchema)