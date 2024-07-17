const { mergeResolvers } = require('@graphql-tools/merge')
const userResolvers = require('./users')
const lessonResolvers = require('./lessons')
const sectionResolvers = require('./sections')
const resourceResolvers = require('./resources')

const resolvers = mergeResolvers([
  userResolvers,
  lessonResolvers,
  sectionResolvers,
  resourceResolvers,
])

module.exports = resolvers