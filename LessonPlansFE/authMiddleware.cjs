/* 
this middleware provides a mock authorization while working on the FE
with a json-server
*/

module.exports = (req, res, next) => {
  if (req.method === 'POST' && req.path === '/auth/login') {
      if (req.body.username === 'admin' && req.body.password === 'password') {
          res.status(200).json({
              user: { id: 1, username: 'admin' },
              token: 'mock-token'
          });
      } 
      else {
          res.status(400).json({ message: 'Incorrect username or password' });
      }
  } else {
      next();
  }
};



