const User = require('./models/user')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const context = async ({ req, res }) => {
  console.log('Context function called')
  const auth = req ? req.headers.authorization : null
  console.log('Authorization header:', auth)
  if (auth && auth.startsWith('Bearer ')) {
    const decodedToken = jwt.verify(
      auth.substring(7), process.env.JWT_SECRET
    )
    const currentUser = await User.findById(decodedToken.id)
    return { currentUser }
  }
}

module.exports = context