const User = require('./models/user')
const Lesson = require('./models/lesson')
const { GraphQLError } = require('graphql')

const validation = (username, role) => {
  if (username.length < 3 ) {
    throw new GraphQLError('Username must be at least 3 characters long', {
      extensions: {
        code: 'BAD_USER_INPUT'
      }
    })
  }
  if (password.length < 8 ) {
    throw new GraphQLError('Password must be at least 8 characters long', {
      extensions: {
        code: 'BAD_USER_INPUT'
      }
    })
  }
  if (!['teacher', 'substitute', 'admin'].includes(role)) {
    throw new GraphQLError(`Role must be 'teacher', 'substitute', or 'admin'`, {
      extensions: {
        code: 'BAD_USER_INPUT'
      }
    })
  }
}

const resolvers = {
  Query: {
    users: async () => {
      try {
        return await User.find({})
      } catch (error) {
        throw new Error('Error fetching users')
      }
    },
    lessons: async () => {
      try {
        return await Lesson.find({})
      } catch (error) {
        throw new Error('Error fetching lessons')
      }
    },
    lesson: async (_, { id }) => {
      try {
        const lesson = await Lesson.findById(id)
        if (!lesson) {
          throw new Error('No lesson found')
        }
        return lesson
      } catch (error) {
        throw new Error('Error fetching lesson')
      }
    }
  },
  Mutation: {
    addUser: async (_, { username, password, role }) => {
      validation(username, password, role)
      try {
        const user = new User({ username, password, role })
        await user.save()
        return user
      } catch (error) {
        throw new Error('Error adding user')
      }
    },
    addLesson: async(root, args) => {
      try {
        const lesson = new Lesson({ ...args})
        await lesson.save()
        return lesson
      } catch (error) {
        throw new Error('Error adding lesson')
      }
    }
  }
}

module.exports = resolvers

/*prior to error handling
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
*/