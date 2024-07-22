const mongoose = require('mongoose')
const User = require('./models/user')
const Lesson = require('./models/lesson')
const Section = require('./models/section')
const Resource = require('./models/resource')
const initialData = require('./db.json')

const loadInitialData = async () => {
  //await User.deleteMany({})
/*    await Lesson.deleteMany({})
  await Section.deleteMany({})
  await Resource.deleteMany({})  */
  try {
    console.log('Checking for existing data...')

    const userCount = await User.countDocuments()
    const lessonCount = await Lesson.countDocuments()
    const sectionCount = await Section.countDocuments()
    const resourceCount = await Resource.countDocuments()
    const collectionSum = userCount + lessonCount + sectionCount + resourceCount

    if (collectionSum === 0)  {
      console.log('No existing data. Loading initial data')
      await User.insertMany(initialData.users)
/*       await Lesson.insertMany(initialData.lessons)
      await Section.insertMany(initialData.sections)
      await Resource.insertMany(initialData.resources) */
      console.log('Initial data loaded.')
    } else {
      console.log('Database not empty. Skipping initial data load.')
    }
 
  } catch (error) {
    console.error('Error loading initial data:', error)
  }
}

module.exports = loadInitialData