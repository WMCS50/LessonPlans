import { gql } from '@apollo/client'

// User Queries and Mutations
export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const ADD_USER = gql`
  mutation AddUser($username: String!, $password: String!, $role: String!) {
    addUser(username: $username, password: $password, role: $role) {
      id
      username
      role
    }
  }
`

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      role
    }
  }
`

export const ME = gql`
  query Me {
    me {
      id
      username
      role
    }
  }
`

// Lesson Queries and Mutations
export const GET_LESSONS = gql`
  query GetLessons {
    lessons {
      id
      title
      sections {
        id
        title
      }
      resources {
        id
        title
        type
      }
      createdBy
      dateModified
      courseAssociations
    }
  }
`

export const GET_LESSON = gql`
  query GetLesson($id: ID!) {
    lesson(id: $id) {
      id
      title
      sections {
        id
        title
      }
      resources {
        id
        title
        type
        link
        startTime
        endTime
        sectionId
        content
      }
      createdBy
      dateModified
      courseAssociations
    }
  }
`

export const DELETE_LESSON = gql`
  mutation DeleteLesson($id: ID!) {
    deleteLesson(id: $id) {
      id
    }
  }
`

export const ADD_LESSON = gql`
  mutation AddLesson($title: String!, $sections: [ID], $resources: [ID], $dateModified: String!, $courseAssociations: [String]) {
    addLesson(title: $title, sections: $sections, resources: $resources, dateModified: $dateModified, courseAssociations: $courseAssociations) {
      id
      title
      sections {
        id
        title
      }
      resources {
        id
        title
        type
      }
      createdBy
      dateModified
      courseAssociations
    }
  }
`

export const UPDATE_LESSON = gql`
  mutation UpdateLesson($id: ID!, $title: String!, $sections: [ID], $resources: [ID], $dateModified: String!, $courseAssociations: [String]) {
    updateLesson(id: $id, title: $title, sections: $sections, resources: $resources, dateModified: $dateModified, courseAssociations: $courseAssociations) {
      id
      title
      sections {
        id
        title
      }
      resources {
        id
        title
        type
      }
      dateModified
      courseAssociations
    }
  }
`

export const GET_SECTIONS = gql`
  query GetSections($lessonId: ID!) {
    sections(lessonId: $lessonId) {
      id
      title
      resources {
        id
        title
        type
        link
        startTime
        endTime
        content
      }
    }
  }
`


export const UPDATE_SECTIONS = gql`
  mutation UpdateSections($lessonId: ID!, $sectionIds: [ID!]!) {
    updateSections(lessonId: $lessonId, sectionIds: $sectionIds) {
      id
      sections {
        id
        title
      }
    }
  }
`

// Section Queries and Mutations
export const ADD_SECTION = gql`
  mutation AddSection($title: String!, $lessonId: ID!) {
    addSection(title: $title, lessonId: $lessonId) {
      id
      title
      lessonId
    }
  }
`

export const UPDATE_SECTION = gql`
  mutation UpdateSection($id: ID!, $title: String) {
    updateSection(id: $id, title: $title) {
      id
      title
    }
  }
`

export const REORDER_RESOURCES = gql`
  mutation ReorderResources($sectionId: ID!, $resourceIds: [ID!]!) {
    reorderResources(sectionId: $sectionId, resourceIds: $resourceIds) {
      id
      resources {
        id
        title
      }
    }
  }
`

// Resource Queries and Mutations
export const ADD_RESOURCE = gql`
  mutation AddResource($type: String!, $title: String!, $link: String, $startTime: String, $endTime: String, $content: String, $sectionId: ID!) {
    addResource(type: $type, title: $title, link: $link, startTime: $startTime, endTime: $endTime, content: $content, sectionId: $sectionId) {
      id
      title
      type
      link
      startTime
      endTime
      content
      sectionId
    }
  }
`

export const UPDATE_RESOURCE = gql`
  mutation UpdateResource($id: ID!, $title: String, $link: String, $startTime: String, $endTime: String, $content: String) {
    updateResource(id: $id, title: $title, link: $link, startTime: $startTime, endTime: $endTime, content: $content) {
      id
      title
      type
    }
  }
`
