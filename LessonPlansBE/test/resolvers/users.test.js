const supertest = require('supertest')
const { test, after, before, beforeEach } = require('node:test')
const { initializeDatabase } = require('../test_helper')
const mongoose = require('mongoose')
const start = require('../../index')
const assert = require('assert')
const User = require('../../models/user')

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

after(async () => {
  await mongoose.connection.close()
}) 
