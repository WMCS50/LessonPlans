const mongoose = require('mongoose')

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  resources: { type: Array, default: [] }
})

const resourceSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true},
  link: { type: String},
  startTime: { type: String },
  endTime: { type: String },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  content: { type: String }
})


const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true},
  sections: [sectionSchema],
  resources: [resourceSchema],
  createdBy: { type: String, required: true},
  dateModified: { type: Date, required: true},
  courseAssociations: { type: [String], required: true}  
})

const Lesson = mongoose.model('Lesson', lessonSchema)

module.exports = Lesson