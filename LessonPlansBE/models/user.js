const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minLength: 3 },
  password: { type: String, required: true, minLength: 8 },
  role: { type: String, required: true, enum: ['teacher', 'substitute', 'admin'] }
})

const User = mongoose.model('User', userSchema)

module.exports = User