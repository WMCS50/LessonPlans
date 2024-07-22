/* 
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
*/

const { GraphQLError } = require('graphql')
const Lesson = require('../models/lesson')
const Section = require('../models/section')
const Resource = require('../models/resource')
const { convertIdsToObjectIds } = require('./resolversHelper')

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
    addLesson: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('User not authenticated')
      }

      try {
        const lesson = new Lesson({ 
          title: args.title, 
          sections: args.sections,
          resources: args.resources,
          createdBy: context.currentUser.username,
          dateModified: new Date(),
          courseAssociations: args.courseAssociations 
        })
        await lesson.save()
        console.log('Lesson saved successfully:', lesson)
        return lesson
/*         const populatedLesson = await Lesson.findById(lesson._id)
          .populate('sections')
          .populate('resources')
          console.log('Populated Lesson', populatedLesson)

        return populatedLesson */
      
      } catch (error) {
        console.error('Error adding lesson:', error)
        throw new Error('Error adding lesson')
      }
    },

    updateLesson: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('User not authenticated')
      }
      console.log('Starting updateLesson resolver')
            
      try {
        const lesson = await Lesson.findByIdAndUpdate(args.id)
        if (!lesson) {
          throw new GraphQLError(`Lesson with id ${args.id} not found`)
        }
        if (lesson.createdBy !==context.currentUser.username) {
          throw new GraphQLError('User not authorized to update this lesson')
        }
         
        const updatedLesson = await Lesson.findByIdAndUpdate(
          args.id,
          {
            title: args.title,
            sections: args.sections,
            resources: args.resources,
            createdBy: context.currentUser.username,
            dateModified: new Date(),
            courseAssociations: args.courseAssociations
          },
          { new: true }
        )
        console.log('Lesson updated successfully', updatedLesson)
        return updatedLesson
      } catch (error) {
        console.error('Error updating lesson', error)
        throw new Error('Error updating lesson')
      }
    },
  },
}

module.exports = lessonResolvers


