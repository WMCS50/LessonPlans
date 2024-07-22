const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types


const convertIdsToObjectIds = async (ids, Model, idType) => {
  console.log(`Converting IDs for ${idType}:`, ids)
  
  const convertedIDs = []

  await Promise.all(ids.map(async id => {
    const document = await Model.findById(id)
    if (!document) {
      throw new GraphQLError(`${idType} with id ${id} not found`);
    }
    console.log('did i get this far?')
    console.log(`Converted ${idType} ID: ${id} to ObjectId: ${ObjectId.createFromHexString(id)}`)
    convertedIDs.push(ObjectIds.createFromHexString(id))
  }))
    return convertedIDs
}



/* const convertIdToObjectId = async (id, Model, idType) => {
  console.log(`Converting ID for ${idType}:`, id)
    const document = await Model.findById(id)
    if (!document) {
      throw new GraphQLError(`${idType} with id ${id} not found`)
    }
    console.log(`Converted ${idType} ID: ${id} to ObjectId: ${ObjectId.createFromHexString(id)}`)
    return ObjectId.createFromHexString(id)
} */

module.exports = { 
  convertIdsToObjectIds, 
  /* convertIdToObjectId */ }
  