const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./utils/connectDB')

const app = express()
app.use(express.json())

const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(',') : []

const corsOptions = {
  origin(origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}

app.use(cors(corsOptions))

app.use(express.static(`${__dirname}/public`))

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
const { users, staffs, chairs, records } = require('./routes')

const passport = require('passport')
const BearerStrategy = require('passport-http-bearer')
passport.use(
  'user',
  new BearerStrategy({ passReqToCallback: true }, function (req, token, done) {
    User.findOne({ token })
      .then(user => done(null, user || false))
      .catch(err => done(err))
  })
)

const userAuthenticate = passport.authenticate('user', { session: false })

app.use('/api/login', express.Router().post('/', $(users.login)))
app.use('/api/signup', express.Router().post('/', $(users.signup)))
app.use('/api/resetPassword', express.Router().post('/', $(users.resetPassword)))

app.use('/api/records', userAuthenticate, express.Router().get('/', $(records.findOne)).post('/', $(records.create)))
app.use('/api/staffs', userAuthenticate, express.Router().get('/', $(staffs.getAll)).post('/', $(staffs.create)).put('/:id', $(staffs.update)).delete('/:id', $(staffs.remove)))
app.use('/api/chairs', userAuthenticate, express.Router().get('/', $(chairs.getAll)).post('/', $(chairs.create)).put('/:id', $(chairs.update)).delete('/:id', $(chairs.remove)))

const server = app.listen(process.env.PORT || 3222, () => {
  console.log('server started at port:', server.address().port)
})

require('./utils/io').initialize(server)
