const User = require('../models/user')
const Lesson = require('../models/lesson')
const initialData = require('../db.json')
const bcrypt = require('bcrypt')

const initializeDatabase = async () => {
  await User.deleteMany({})
  //await Lesson.deleteMany({})

  await User.insertMany(initialData.users)
  //await Lesson.insertMany(initialData.lessons)
}

module.exports = { initializeDatabase }