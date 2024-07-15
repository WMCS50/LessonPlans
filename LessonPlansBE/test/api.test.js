const supertest = require('supertest')
const { test, after, before, beforeEach } = require('node:test')
const { initializeDatabase } = require('./test_helper')
const mongoose = require('mongoose')
const start = require('../index')
const assert = require('assert')

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

test('lessons are stored in an array and each lesson has a title', async () => {
  const response = await api 
    .post('/graphql')
    .send({
      query: `
      {
        lessons {
        title
        }
      }`
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert(Array.isArray(response.body.data.lessons))
  assert.strictEqual(response.body.data.lessons.length, 4)
  response.body.data.lessons.forEach(lesson => {
    assert(lesson.title, 'Each lesson should have a title')
  })
})

after(async () => {
  await mongoose.connection.close()
}) 