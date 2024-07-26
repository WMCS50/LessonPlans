const { GraphQLError } = require('graphql')
const Lesson = require('../models/lesson')

const lessonResolvers = {
  Query: {
    lessons: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('User not authenticated')
      }
      try {
        const lessons = await Lesson.find({
          $or: [
            { createdBy: context.currentUser.username },
            { sharedWith: context.currentUser._id }
          ]
        })
        .populate('sections')
        .populate('resources')
        .populate('sharedWith')
 
        lessons.forEach(lesson => console.log('Raw sharedWith:', lesson.sharedWith));
       
        console.log('lessons', lessons)
        
        return lessons.map(lesson => lesson.toJSON())
      } catch (error) {
        throw new GraphQLError('Error fetching lessons')
      }
    },
    lesson: async (_, { id }) => {
      try {
        const lesson = await Lesson.findById(id)
          .populate('sections')
          .populate('resources')
          .populate('sharedWith')

        if (!lesson) {
          throw new Error('No lesson found')
        }
        console.log('Raw sharedWith:', lesson.sharedWith)
       
        console.log('lesson', lesson)
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
          courseAssociations: args.courseAssociations,
          sharedWith: args.sharedWith
        })
        await lesson.save()

        const populatedLesson = await Lesson.findById(lesson._id)
        .populate('sections')
        .populate('resources')
        .populate('sharedWith')

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
            courseAssociations: args.courseAssociations,
            sharedWith: args.sharedWith
          },
          { new: true }
        )
          .populate('sections')
          .populate('resources')
          .populate('sharedWith')

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
    },

    shareLesson: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('User not authenticated')
      }
      
      try {
        const sharedLesson = await Lesson.findByIdAndUpdate(args.id,
          {
            $addToSet: { sharedWith: { $each: args.users} },
          },
          { new: true } 
        )
        .populate('sections')
        .populate('resources')
        .populate('sharedWith')

      console.log('Lesson shared successfully:', sharedLesson)
      console.log('sharedLesson')
      return sharedLesson
      } catch (error) {
        console.error('Error sharing lesson', error)
        throw new Error('Error sharing lesson')
      }
    }
  },
}

module.exports = lessonResolvers


