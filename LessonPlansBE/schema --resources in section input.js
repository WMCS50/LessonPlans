const typeDefs = `
  input SectionInput {
    title: String!
    resources: [ResourceInput],
    id: ID!
  }

  input ResourceInput {
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
      courseAssociations: [String]
    ): Lesson

    updateLesson(
      id: ID!
      title: String!
      sections: [SectionInput]
      resources: [ResourceInput]
      dateModified: String!
      courseAssociations: [String]
    ): Lesson

    updateSection(
        id: ID!,
        title: String
    ): Section

    updateResource(
        id: ID!,
        title: String,
        link: String,
        startTime: String,
        endTime: String,
        content: String
    ): Resource

    updateSections(
        lessonId: ID!,
        sectionIds: [ID!]!
    ): Lesson

    reorderResources(
        sectionId: ID!,
        resourceIds: [ID!]!
    ): Section
  }
  
  `
  

  module.exports = typeDefs