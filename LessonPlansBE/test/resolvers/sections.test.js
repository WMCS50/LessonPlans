const supertest = require('supertest')
const { test, after, before, beforeEach } = require('node:test')
const { initializeDatabase } = require('../test_helper')
const mongoose = require('mongoose')
const start = require('../../index')
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

test('update section title', async () => {
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

  const updateSectionResponse = await api
    .post('/graphql')
    .set('Authorization', `Bearer ${token}`)
    .send({
      query: `
      mutation {
        updateSection(id: "${sectionId}", title: "Updated Part 1") {
          id
          title
        }
      }`
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const updatedSection = updateSectionResponse.body.data.updateSection
  assert(updatedSection.title === 'Updated Part 1')
})

after(async () => {
  await mongoose.connection.close()
}) 
