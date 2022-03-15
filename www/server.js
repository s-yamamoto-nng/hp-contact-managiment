const express = require('express')
const cors = require('cors')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./utils/connectDB')

const app = express()
const server = app.listen(process.env.PORT || 3222, () => {
  console.log('server started at port:', server.address().port)
})

app.use(express.json())
app.use(cors())

const createError = require('http-errors')
const HttpError = createError.HttpError
const $ = handler => async (req, res) => {
  try {
    const data = await handler(req, res)
    if (!res.headersSent) res.status(200).json(data)
  } catch (err) {
    if (err instanceof HttpError) {
      res.status(err.status).json(err)
    } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
      res.status(404).json({ message: 'Not Found' })
    } else if (err.name === 'ValidationError') {
      const errors = {}
      Object.keys(err.errors).forEach(field => (errors[field] = err.errors[field].message))
      res.status(400).json({ message: err.message, errors })
    } else {
      console.log('Unhandled Error:', err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}

const { User } = require('./models')
const { users, projects, tasks } = require('./routes')

const passport = require('passport')
const BearerStrategy = require('passport-http-bearer')
passport.use(
  'user',
  new BearerStrategy({ passReqToCallback: true }, function(req, token, done) {
    User.findOne({ token })
      .then(user => done(null, user || false))
      .catch(err => done(err))
  })
)

const userAuthenticate = passport.authenticate('user', { session: false })

app.use('/api/login', express.Router().post('/', $(users.login)))
app.use('/api/signup', express.Router().post('/', $(users.signup)))
app.use('/api/resetPassword', express.Router().post('/', $(users.resetPassword)))
app.use('/api/userRequest', express.Router().post('/:id', $(users.userRequest)))
app.use('/api/userApproval', express.Router().post('/', $(users.userApproval)))
app.use('/api/users', express.Router().get('/', $(users.getAll)))
app.use('/api/removeUsers', userAuthenticate, express.Router().put('/:id', $(users.remove)))

app.use(
  '/api/projects',
  userAuthenticate,
  express
    .Router()
    .get('/', $(projects.getAll))
    .post('/', $(projects.create))
    .put('/:id', $(projects.update))
)
app.use('/api/removeProjects', userAuthenticate, express.Router().put('/:id', $(projects.remove)))

app.use(
  '/api/tasks',
  userAuthenticate,
  express
    .Router()
    .get('/', $(tasks.getAll))
    .post('/', $(tasks.create))
    .put('/:id', $(tasks.update))
)
app.use('/api/removeTasks', userAuthenticate, express.Router().put('/:id', $(tasks.remove)))

app.use('/api/readFlgTask', userAuthenticate, express.Router().post('/:id', $(tasks.readFlgTask)))

app.use(express.static(__dirname + '/public'))

require('./utils/io').initialize(server)
