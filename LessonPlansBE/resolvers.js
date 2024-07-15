const User = require('./models/user')
const Lesson = require('./models/lesson')
const { GraphQLError } = require('graphql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const validation = (username, password, role) => {
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
    },
    me: (root, args, context) => {
      console.log('****context****', context)
      return context.currentUser
    }
  },
  Mutation: {
    addUser: async (_, { username, password, role }) => {
      validation(username, password, role)
      
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)
      
      try {
        const user = new User({ username, passwordHash, role })
        await user.save()
        return user
      } catch (error) {
        throw new Error('Error adding user')
      }
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username })
      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

      if (!(user && passwordCorrect)) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET)}
    },
    addLesson: async(root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      try {
        const lesson = new Lesson({ ...args, createdBy: context.currentUser.username })
        await lesson.save()
        return lesson
      } catch (error) {
        throw new Error('Error adding lesson')
      }
    }
  }
}

module.exports = resolvers