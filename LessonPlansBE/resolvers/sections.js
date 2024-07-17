const Section = require('../models/section')
const { GraphQLError } = require('graphql')

const sectionResolvers = {
  Mutation: {
    addSection: async(_, { title }) => {
      try {
        const section = new Section({ title })
        await section.save()
        return section
      } catch (error) {
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