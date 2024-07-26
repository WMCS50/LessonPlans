const { mergeResolvers } = require('@graphql-tools/merge')
const userResolvers = require('./users')
const lessonResolvers = require('./lessons')

const resolvers = mergeResolvers([
  userResolvers,
  lessonResolvers,
])

module.exports = resolvers