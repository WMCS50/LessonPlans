const mongoose = require('mongoose')
const Resource = require('./resource')

const sectionSchema = new mongoose.Schema({
  title: { type: String },
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
})

sectionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Section = mongoose.model('Section', sectionSchema)

module.exports = Section