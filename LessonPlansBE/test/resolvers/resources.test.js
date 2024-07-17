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

test('update resource title', async () => {
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

  const updateResourceResponse = await api
    .post('/graphql')
    .set('Authorization', `Bearer ${token}`)
    .send({
      query: `
      mutation {
        updateResource(id: "${resourceId}", title: "Updated Resource") {
          id
          title
        }
      }`
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const updatedResource = updateResourceResponse.body.data.updateResource
  assert(updatedResource.title === 'Updated Resource')
})

after(async () => {
  await mongoose.connection.close()
}) 
