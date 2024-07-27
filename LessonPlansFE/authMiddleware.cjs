//This middleware provides a mock authorization while working on the FE with a json-server
//I used this when working on the FE but before any BE work.
//Leaving in the code just to show the work; however, this is unused now

// eslint-disable-next-line no-undef
module.exports = (req, res, next) => {
  if (req.method === 'POST' && req.path === '/auth/login') {
    if (req.body.username === 'admin' && req.body.password === 'password') {
      res.status(200).json({
        user: { id: 1, username: 'admin' },
        token: 'mock-token'
      })
    }
    else {
      res.status(400).json({ message: 'Incorrect username or password' })
    }
  } else {
    next()
  }
}
