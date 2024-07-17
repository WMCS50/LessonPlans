const Lesson = require('../models/lesson')
const Section = require('../models/section')
const Resource = require('../models/resource')
const { GraphQLError } = require('graphql')

const lessonResolvers = {
  Query: {
    lessons: async () => {
      try {
        const lessons = await Lesson.find({}).populate('sections').populate('resources')
        return lessons.map(lesson => lesson.toJSON())
      } catch (error) {
        throw new GraphQLError('Error fetching lessons')
      }
    },
    lesson: async (_, { id }) => {
      try {
        const lesson = await Lesson.findById(id).populate('sections').populate('resources')
        if (!lesson) {
          throw new Error('No lesson found')
        }
        return lesson.toJSON()
      } catch (error) {
        throw new GraphQLError('Error fetching lesson')
      }
    },
  },
  Mutation: {
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
    },
    reorderSections: async(_, { lessonId, sectionIds }) => {
      try {
        const lesson = await Lesson.findById(lessonId)
        if (!lesson) {
          throw new GraphQLError('Lesson not found')
        }
        lesson.sections = sectionIds.map((id) => mongooseTypes.ObjectId(id))
        await lesson.save()
        return (await lesson.populate('sections')).populate('resources')
      } catch (error) {
        throw new GraphQLError('Error reordering sections')
      }
    }
  }
}

module.exports = lessonResolvers