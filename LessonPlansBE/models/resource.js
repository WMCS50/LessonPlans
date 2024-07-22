const mongoose = require('mongoose')
const Section = require('./section')


const resourceSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String},
  link: { type: String},
  startTime: { type: String },
  endTime: { type: String },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  content: { type: String }
})

resourceSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Resource = mongoose.model('Resource', resourceSchema)

module.exports = Resource