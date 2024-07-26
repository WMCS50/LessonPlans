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
        content
      }
      createdBy
      dateModified
      courseAssociations
      sharedWith {
        id
        username
        role
      }
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
      sharedWith {
        id
        username
        role
      }
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
  mutation AddLesson($title: String!, $sections: [SectionInput], $resources: [ResourceInput], $dateModified: String!, $courseAssociations: [String], $sharedWith: [ID]) {
    addLesson(title: $title, sections: $sections, resources: $resources, dateModified: $dateModified, courseAssociations: $courseAssociations, sharedWith: $sharedWith) {
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
      sharedWith {
        id
        username
        role
      }
    }
  }
`

export const UPDATE_LESSON = gql`
  mutation UpdateLesson($id: ID!, $title: String!, $sections: [SectionInput], $resources: [ResourceInput], $dateModified: String!, $courseAssociations: [String],  $sharedWith: [ID]) {
    updateLesson(id: $id, title: $title, sections: $sections, resources: $resources, dateModified: $dateModified, courseAssociations: $courseAssociations, sharedWith: $sharedWith) {
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
      dateModified
      courseAssociations
      sharedWith {
        id
        username
        role
      }
    }
  }
`

export const SHARE_LESSON = gql`
  mutation ShareLesson($id: ID!, $users: [ID]!) {
    shareLesson(id: $id, users: $users) {
      id
      title
      sharedWith {
        id
        username
        role
      }
    }
  }  
`