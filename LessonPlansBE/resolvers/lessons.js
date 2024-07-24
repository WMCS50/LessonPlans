const { GraphQLError } = require('graphql')
const Lesson = require('../models/lesson')

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

      //ensure unique lesson names
      const existingLesson = await Lesson.findOne({
        title: args.title,
        createdBy: context.currentUser.username
      })

      if (existingLesson) {
        throw new GraphQLError('Lesson titles must be unique for each user')
      }

      //ensure sectionIDs and resourceIDs in FE are maintained in BE
      const sections = args.sections.map(section => {
        if (section.id) {
          return { ...section, _id: section.id };
        }
        return section
      })
  
      const resources = args.resources.map(resource => {
        if (resource.id) {
          return { ...resource, _id: resource.id };
        }
        return resource
      })

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

        const populatedLesson = await Lesson.findById(lesson._id)
        .populate('sections')
        .populate('resources')

        console.log('Lesson saved successfully:', populatedLesson)
        return populatedLesson
      } catch (error) {
        console.error('Error adding lesson:', error)
        throw new Error('Error adding lesson')
      }
    },
   
    updateLesson: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('User not authenticated')
      }
      
      const existingLesson = await Lesson.findOne({
        title: args.title,
        createdBy: context.currentUser.username
      })

      if (existingLesson) {
        throw new GraphQLError('Lesson titles must be unique for each user')
      }

      const sections = args.sections.map(section => {
        if (section.id) {
          return { ...section, _id: section.id };
        }
        return section
      })
  
      const resources = args.resources.map(resource => {
        if (resource.id) {
          return { ...resource, _id: resource.id };
        }
        return resource
      })

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
            sections,
            resources,
            createdBy: context.currentUser.username,
            dateModified: new Date(),
            courseAssociations: args.courseAssociations
          },
          { new: true }
        )
          .populate('sections')
          .populate('resources')
        console.log('Lesson updated successfully', updatedLesson)
        return updatedLesson
 
      } catch (error) {
        console.error('Error updating lesson', error)
        throw new Error('Error updating lesson')
      }
    },
    
    deleteLesson: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('User not authenticated')
      }
  
      try {
        const lesson = await Lesson.findById(args.id)
        
        if (!lesson) {
          throw new GraphQLError(`Lesson with id ${args.id} not found`)
        }
        if (lesson.createdBy !== context.currentUser.username) {
          throw new GraphQLError('User not authorized to delete this lesson')
        }
  
        await Lesson.findByIdAndDelete(args.id)
        return { id: args.id }
      } catch (error) {
        console.error('Error deleteing lesson', error)
        throw new GraphQLError('Error deleting lesson')
      }
    }
  },

}

module.exports = lessonResolvers


