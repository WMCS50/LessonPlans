const Section = require('../models/section')
const Lesson = require('../models/lesson')
const { GraphQLError } = require('graphql')
const { convertIdToObjectId } = require('./resolversHelper')

const sectionResolvers = {
  Query: {
    sections: async (_, { lessonId }) => {
      try {
        const lesson = await Lesson.findById(lessonId).populate('sections')
        if (!lesson) {
          throw new Error('Lesson not found')
        }
        return lesson.sections
      } catch (error) {
        throw new Error('Error fetching sections')
      }
    },
  },
  Mutation: {
    addSection: async (_, { title, lessonId }) => {
      const lessonObjectId = await convertIdToObjectId(lessonId, Lesson, 'Lesson')

      try {
        const lesson = await Lesson.findById(lessonObjectId);
        if (!lesson) {
          throw new Error('Lesson not found')
        }
        const section = new Section({ title, lessonId: lessonObjectId })
        await section.save()
        console.log('Section added successfully:', section)

        // Update the corresponding lesson
        lesson.sections.push(section._id)
        await lesson.save()

        return section
      } catch (error) {
        console.log('Error adding section:', error)
        throw new GraphQLError('Section not added')
      }
    },
    updateSection: async (_, { id, title }) => {
      try {
        const section = await Section.findByIdAndUpdate(id, { title }, { new: true })
        return section
      } catch (error) {
        throw new GraphQLError('Error updating section');
      }
    },
    updateSections: async (_, { lessonId, sectionIds }) => {
      try {
        const lesson = await Lesson.findById(lessonId)
        if (!lesson) {
          throw new GraphQLError('Lesson not found')
        }
        lesson.sections = sectionIds.map((id) => mongooseTypes.ObjectId(id))
        await lesson.save()
        //return lesson.populate('sections')
        return lesson
      } catch (error) {
        throw new GraphQLError('Error updating sections')
      }
    },
    reorderResources: async(_, { sectionId, resourceIds }) => {
      try {
        const section = await Section.findById(sectionId)
        if (!section) {
          throw new GraphQLError('Section not found')
        }
        section.resources = resourceIds.map((id) => mongooseTypes.ObjectId(id))
        await section.save()
        return await section.populate('resources')
      } catch (error) {
        throw new GraphQLError('Error reordering resources')
      }
    } 
  }
}

module.exports = sectionResolvers