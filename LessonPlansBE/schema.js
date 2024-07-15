const typeDefs = `
  type User {
    id: ID!
    username: String!
    role: String!
  }

  type Token {
    value: String!
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
    link: String
    startTime: String
    endTime: String
    sectionId: ID!
    content: String
  }

  type Query {
    users: [User]
    lessons: [Lesson]
    lesson(id: ID!): Lesson
    me: User
  }

  type Mutation {
    addUser(
      username: String!,
      password: String!,
      role: String!
    ): User
    login(
      username: String!,
      password: String!
    ): Token 
    addLesson(
      title: String!,
      sections: [SectionInput],
      resources: [ResourceInput],
      createdBy: String!,
      dateModified: String!,
      courseAssociations: [String]
    ): Lesson
  }
  
  input SectionInput {
    title: String
    resources: [ResourceInput]
  }

  input ResourceInput {
    type: String
    title: String
    link: String
    startTime: String
    endTime: String
    sectionId: ID!
    content: String
  }

  `

  module.exports = typeDefs