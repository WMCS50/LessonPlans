const mongoose = require('mongoose')

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true},
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true }],
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource'}],
  createdBy: { type: String, required: true},
  dateModified: { type: Date, required: true, default: Date.now },
  courseAssociations: { type: [String] },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]   
})

const Lesson = mongoose.model('Lesson', lessonSchema)

module.exports = Lesson