const User = require('../models/user')
const Lesson = require('../models/lesson')
const initialData = require('../db.json')
const bcrypt = require('bcrypt')

const initializeDatabase = async () => {
  await User.deleteMany({})
  await Lesson.deleteMany({})

  const saltRounds = 10
  const usersWithHash = await Promise.all(initialData.users.map(
    async user => {
      const passwordHash = await bcrypt.hash(user.password, saltRounds)
      return { ...user, passwordHash }
  }))

  await User.insertMany(usersWithHash)
  await Lesson.insertMany(initialData.lessons)
}

module.exports = { initializeDatabase }