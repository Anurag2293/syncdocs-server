import mongoose, { Schema } from 'mongoose'

const DocumentSchema = new Schema({
    _id: String,
    data: Object
})

const Document = mongoose.model('Document', DocumentSchema)

export default Document;