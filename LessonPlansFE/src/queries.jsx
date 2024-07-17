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
        resources {
          id
          title
          type
        }
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

export const DELETE_LESSON = gql`
  mutation DeleteLesson($id: ID!) {
    deleteLesson(id: $id) {
      id
    }
  }
`

export const ADD_LESSON = gql`
  mutation AddLesson($title: String!, $sections: [ID!], $resources: [ID], $createdBy: String!, $dateModified: String!, $courseAssociations: [String]) {
    addLesson(title: $title, sections: $sections, resources: $resources, createdBy: $createdBy, dateModified: $dateModified, courseAssociations: $courseAssociations) {
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
  mutation UpdateLesson($id: ID!, $title: String!, $sections: [ID!], $resources: [ID], $createdBy: String!, $dateModified: String!, $courseAssociations: [String]) {
    updateLesson(id: $id, title: $title, sections: $sections, resources: $resources, createdBy: $createdBy, dateModified: $dateModified, courseAssociations: $courseAssociations) {
      id
      title
      courseAssociations
      createdBy
      dateModified
    }
  }
`

export const REORDER_SECTIONS = gql`
  mutation ReorderSections($lessonId: ID!, $sectionIds: [ID!]!) {
    reorderSections(lessonId: $lessonId, sectionIds: $sectionIds) {
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
  mutation AddSection($title: String!) {
    addSection(title: $title) {
      id
      title
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
