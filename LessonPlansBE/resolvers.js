const User = require('./models/user')
const Lesson = require('./models/lesson')

const resolvers = {
  Query: {
    users: () => users,
    lessons: () => lessons,
    lesson: (_, { id }) => lessons.find(lesson => lesson.id === parseInt(id))
  },
  Mutation: {
    addUser: async (root, args) => {
      const user = new User({ ...args })
      await user.save()
      return user
    },
    addLesson: async(root, args) => {
      const lesson = new Lesson({ ...args})
      await lesson.save()
      return lesson
    }
  }
}

module.exports = resolvers