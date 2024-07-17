const Resource = require('../models/resource')
const { GraphQLError } = require('graphql')

const resourceResolvers = {
  Mutation: {
    addResource: async(_, { type, title, link, startTime, endTime, content, sectionId }) => {
      try {
        const resource = new Resource({ type, title, link, startTime, endTime, content, sectionId })
        await resource.save()
        return resource
      } catch (error) {
        throw new GraphQLError('Resource not added')
      }
    },
    updateResource: async (_, { id, title, link, startTime, endTime, content }) => {
      try {
        const resource = await Resource.findByIdAndUpdate(
          id,
          { title, link, startTime, endTime, content },
          { new: true }
        );
        return resource
      } catch (error) {
        throw new GraphQLError('Error updating resource')
      }
    },
  }
}

module.exports = resourceResolvers