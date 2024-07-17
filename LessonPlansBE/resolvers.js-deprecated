const User = require('./models/user')
const Lesson = require('./models/lesson')
const Section = require('./models/section')
const Resource = require('./models/resource')
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
    addSection: async(_, { title }) => {
      try {
        const section = new Section({ title })
        await section.save()
        return section
      } catch (error) {
        throw new GraphQLError('Section not added')
      }
    },
    addResource: async(_, { type, title, link, startTime, endTime, content, sectionId }) => {
      try {
        const resource = new Resource({ type, title, link, startTime, endTime, content, sectionId })
        await resource.save()
        return resource
      } catch (error) {
        throw new GraphQLError('Resource not added')
      }
    },
    addLesson: async(root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('User not authenticated')
      }
      //validate and convert section and resource IDs to Mongoose ObjectIDs
      const sections = await Promise.all(args.sections.map(async sectionId => {
        const section = await Section.findById(sectionId)
        if (!section) {
          throw new GraphQLError(`Section with id ${sectionId} not found`)
        }
        return section._id
      }))
      const resources = await Promise.all(args.resources.map(async resourceId => {
        const resource = await Resource.findById(resourceId)
        if (!resource) {
          throw new GraphQLError(`Resource with id ${resourceId} not found`)
        }
        return resource._id
      }))
      try {
        const lesson = new Lesson({ 
          title: args.title, 
          sections,
          resources,
          createdBy: context.currentUser.username,
          dateModified: new Date(),
          courseAssociations: args.courseAssociations 
        })
        await lesson.save()
        return (await lesson.populate('sections')).populate('resources')
      } catch (error) {
        throw new Error('Error adding lesson')
      }
    }
  }
}

module.exports = resolvers