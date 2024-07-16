const User = require('./models/user')
const Lesson = require('./models/lesson')
const initialData = require('./db.json')

const loadInitialData = async () => {
  try {
    console.log('Clearing existing data...')
    await User.deleteMany({})
   // await Lesson.deleteMany({})

    console.log('Loading initial data...')
    
    // Insert initial users
    await User.insertMany(initialData.users)

    // Insert initial lessons
    //await Lesson.insertMany(initialData.lessons)

    console.log('Initial data loaded.')
  } catch (error) {
    console.error('Error loading initial data:', error)
  }
}

module.exports = loadInitialData
