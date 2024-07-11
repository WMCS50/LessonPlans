const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const loadInitialData = require('./loadInitialData')

dotenv.config()

//connect to mongoDB
const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDb')
    loadInitialData()
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

mongoose.set('debug', true)

const server = new ApolloServer({ typeDefs, resolvers })

startStandaloneServer(server, {
  listen: { port: 4000 }, 
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

/*pre mongoose
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v4: uuidv4 } = require('uuid')

let users = [
  {
    "id": 3,
    "username": "teacher1",
    "password": "hashed_password",
    "role": "teacher"
  },
  {
    "id": 2,
    "username": "substitute1",
    "password": "hashed_password",
    "role": "substitute"
  },
  {
    "id": 1,
    "username": "admin",
    "password": "password",
    "role": "teacher"
  }
]

let lessons = [
  {
    "id": 7,
    "title": "Test lesson",
    "sections": [
      {
        "title": "Part 1",
        "resources": [],
        "id": "2df82cea-14a7-46fa-a549-6ee347155724"
      },
      {
        "id": "bd62b1a8-ea4b-4735-9621-2f7e49044571",
        "title": "Part 2"
      }
    ],
    "resources": [
      {
        "type": "text",
        "title": "part2",
        "link": "",
        "startTime": "",
        "endTime": "",
        "sectionId": "bd62b1a8-ea4b-4735-9621-2f7e49044571",
        "id": "c26a36f7-bda3-4f5e-b9c2-a4b7b1fb964b",
        "content": "<p>Now here's this is a story all about how...</p>\n<p style=\"text-align: left;\">I made an app that you can insert video into.</p>"
      },
      {
        "type": "video",
        "title": "sfdsf",
        "link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "startTime": "100",
        "endTime": "110",
        "sectionId": "bd62b1a8-ea4b-4735-9621-2f7e49044571",
        "id": "6c9dbcff-d31b-47f1-ac9b-e0f9ba96bed8"
      },
      {
        "type": "text",
        "title": "sdfsf",
        "link": "",
        "startTime": "",
        "endTime": "",
        "sectionId": "bd62b1a8-ea4b-4735-9621-2f7e49044571",
        "id": "aaeb9762-6241-4a20-8d9d-6667b0cb4f07",
        "content": "<p style=\"text-align: left;\">And you can also add resources like wherever. Including websites.</p>"
      },
      {
        "type": "website",
        "title": "zillow",
        "link": "https://zillow.com",
        "startTime": "",
        "endTime": "",
        "sectionId": "bd62b1a8-ea4b-4735-9621-2f7e49044571",
        "id": "6173de48-3d2f-4325-8d40-3217a91f9c91"
      },
      {
        "type": "text",
        "title": "Title for Text",
        "link": "",
        "startTime": "",
        "endTime": "",
        "sectionId": "2df82cea-14a7-46fa-a549-6ee347155724",
        "id": "85a368f6-44fc-4023-8b5d-a4b93d256d3d",
        "content": "<p>does this one have a title?</p>"
      },
      {
        "type": "document",
        "title": "sdfdsf",
        "link": "https://pdfobject.com/pdf/sample.pdf",
        "startTime": "",
        "endTime": "",
        "sectionId": "2df82cea-14a7-46fa-a549-6ee347155724",
        "id": "565be3e1-e14e-44a5-a624-317e0dc6d1bf"
      },
      {
        "type": "text",
        "title": "ssdfsf",
        "link": "",
        "startTime": "",
        "endTime": "",
        "sectionId": "2df82cea-14a7-46fa-a549-6ee347155724",
        "id": "662e4cbe-dfeb-40d1-b74d-587a0407c033"
      },
      {
        "type": "text",
        "title": "dfgfdg",
        "link": "",
        "startTime": "",
        "endTime": "",
        "sectionId": "2df82cea-14a7-46fa-a549-6ee347155724",
        "id": "93702ff0-9c7f-40a5-be6f-7db9fb3af9e8",
        "content": "<p>This one's the newest text. Most def left.</p>"
      }
    ],
    "createdBy": "admin",
    "dateModified": "2024-07-10T02:13:42.295Z",
    "courseAssociations": "physics, math, science"
  }
]

const typeDefs = `
  type User {
    id: ID!
    username: String!
    role: String!
  }

  type Lesson {
    id: ID!
    title: String!
    sections: [Section]
    resources: [Resource]
    createdBy: String!
    dateModified: String!
    courseAssociations: String
  }

  type Section {
    id: ID!
    title: String
    resources: [Resource]
  }
  
  type Resource {
    id: ID!
    type: String
    title: String
    startTime: String
    endTime: String
    sectionId: ID!
    content: String
  }

  type Query {
  users: [User]
  lessons: [Lesson]
  lesson(id: ID!): Lesson
  }

  type Mutation {
    addUser(
      username: String!, 
      role: String!
    ): User
  }
  `

const resolvers = {
  Query: {
    users: () => users,
    lessons: () => lessons,
    lesson: (_, { id }) => lessons.find(lesson => lesson.id === parseInt(id))
  },
  Mutation: {
    addUser: (root, args) => {
      const user = { ...args, id: uuidv4() }
      users = [...users, user]
      return user
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

startStandaloneServer(server, {
  listen: { port: 4000 }, 
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
  */