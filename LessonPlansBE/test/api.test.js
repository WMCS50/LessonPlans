const supertest = require('supertest')
const { test, after, before, beforeEach } = require('node:test')
const { initializeDatabase } = require('./test_helper')
const mongoose = require('mongoose')
const start = require('../index')
const assert = require('assert')
const User = require('../models/user')

let app
let api

before(async () => {
  app = await start()
  api = supertest(app)
})

beforeEach(async () => {
  await initializeDatabase()
})

test('users are returned as json and has correct array length', async () => {
  const response = await api 
    .post('/graphql')
    .send({
      query: `
      {
        users {
        id
        username
        role
        }
      }`
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert(Array.isArray(response.body.data.users))
  assert.strictEqual(response.body.data.users.length, 3)
})

test('create new user', async () => {
  const response = await api
    .post('/graphql')
    .send({
      query: `
      mutation {
        addUser(username: "newuser", password: "admin123", role: "admin") {
          id
          username
          role
        }
      }`
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const newUser = response.body.data.addUser
  assert(newUser.username === 'newuser')
  assert(newUser.role === 'admin')

  // tests that the new user passwordHash is stored and not the password itself
  const userInDb = await User.findOne({ username: 'newuser' })
  assert(userInDb.passwordHash)
  assert(!userInDb.password)
}) 

test('login user and add section, resource and lesson', async () => {
  const loginResponse = await api
    .post('/graphql')
    .send({
      query: `
      mutation {
        login(username: "testuser", password: "admin123") {
          value 
        }
      }`
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const token = loginResponse.body.data.login.value
  
  const dateModified = new Date().toISOString()

  const sectionResponse = await api
    .post('/graphql')
    .set('Authorization', `Bearer ${token}`)
    .send({
      query: `
      mutation {
        addSection(title: "Part 1") {
          id
          title
        }
      }`
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const sectionId = sectionResponse.body.data.addSection.id
  const resourceResponse = await api
  .post('/graphql')
  .set('Authorization', `Bearer ${token}`)
  .send({
    query: `
    mutation {
      addResource(
        type: "text", 
        title: "First resource", 
        content: "Here it is, a groove",
        sectionId: "${sectionId}"
      ) {
        id
        title
      }
    }`
  })
  .expect(200)
  .expect('Content-Type', /application\/json/)

  const resourceId = resourceResponse.body.data.addResource.id
  const addLessonResponse = await api
    .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
        mutation {
          addLesson(
            title: "New Lesson",
            createdBy: "testuser",
            dateModified: "${dateModified}",
            sections: ["${sectionId}"],
            resources: ["${resourceId}"],
            courseAssociations: ["Physics"]           
            ) {
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
          }
        }`
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

  const newLesson = addLessonResponse.body.data.addLesson
  console.log('newLesson', newLesson)
  assert(newLesson.title === 'New Lesson')
  assert(newLesson.sections[0].title === 'Part 1')
  assert(newLesson.resources.length === 1)
  assert(newLesson.resources[0].title === 'First resource')
  assert(newLesson.resources[0].type === 'text')
  assert(newLesson.resources[0].content === 'Here it is, a groove')
})
  
after(async () => {
  await mongoose.connection.close()
}) 