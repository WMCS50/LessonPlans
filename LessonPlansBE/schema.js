const typeDefs = `
  input SectionInput {
  id: ID  
  title: String
  }

  input ResourceInput {
    id: ID  
    type: String
    title: String
    link: String
    startTime: String
    endTime: String
    content: String
    sectionId: ID
  }

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
    courseAssociations: [String]
    sharedWith: [User]
  }

  type Section {
    id: ID!
    title: String
    resources: [ID]
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
    sections(lessonId: ID!): [Section!]!
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

    addSection(
      title: String!,
      lessonId: ID!
    ): Section

    addResource(
      type: String!,
      title: String,
      link: String,
      startTime: String,
      endTime: String,
      content: String,
      sectionId: ID!
    ): Resource

    addLesson(
      title: String!,
      sections: [SectionInput],
      resources: [ResourceInput],
      dateModified: String!,
      courseAssociations: [String],
      sharedWith: [ID]
    ): Lesson

    updateLesson(
      id: ID!,
      title: String!,
      sections: [SectionInput],
      resources: [ResourceInput],
      dateModified: String!,
      courseAssociations: [String],
      sharedWith: [ID]
    ): Lesson

    deleteLesson(
      id: ID!
    ): Lesson

    shareLesson(
      id: ID!
      users: [ID]!
    ): Lesson
    
  }
`
  
module.exports = typeDefs