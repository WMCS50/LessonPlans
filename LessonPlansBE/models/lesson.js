const mongoose = require('mongoose')
const Section = require('./section')
const Resource = require('./resource')

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true},
  sections: [Section.schema],
  resources: [Resource.schema],
  createdBy: { type: String, required: true},
  dateModified: { type: Date, required: true, default: Date.now },
  courseAssociations: { type: [String] },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

lessonSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Lesson = mongoose.model('Lesson', lessonSchema)

module.exports = Lesson