const mongoose = require('mongoose')

const resourceSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true},
  link: { type: String},
  startTime: { type: String },
  endTime: { type: String },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  content: { type: String }
})

const Resource = mongoose.model('Resource', resourceSchema)

module.exports = Resource