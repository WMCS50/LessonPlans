const express = require('express')
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const typeDefs = require('./schema')
const resolvers = require('./resolvers/index')
const loadInitialData = require('./loadInitialData')
const morgan = require('morgan')
const cors = require('cors')
const http = require('http')
const context = require('./context')
const path = require('path')

dotenv.config()

//connect to mongoDB
const MONGODB_URI = process.env.MONGODB_URI === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDb')
    if (process.env.NODE_ENV !== 'test') {
      loadInitialData()
    }
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

mongoose.set('debug', true)

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const server = new ApolloServer({ typeDefs, resolvers, context })

  await server.start()

  app.use(express.static('dist'))
  app.use(cors())
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })

  app.use(
    '/graphql',
    morgan(':method :url :status :res[content-length] - :response-time ms'),
    cors(),
    express.json(),
  )

  app.get('/favicon.ico', (req, res) => res.status(204))

  app.use('/graphql', expressMiddleware(server, { context }))

  if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 4000
    httpServer.listen(PORT, () => {
      console.log(`Server is now running on http://localhost:${PORT}`)
    })
  }

  return app
}

if (process.env.NODE_ENV !== 'test') {
  start()
}

module.exports = start